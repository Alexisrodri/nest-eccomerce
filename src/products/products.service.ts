import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { title } from 'process';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger()

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly datasource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productCreate } = createProductDto;

      const product = this.productRepository.create({
        ...productCreate,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      })
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDBExceptions(error);
      console.log(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return products.map(({ images, ...product }) => ({
      ...product,
      images: images.map(img => img.url)
    }))
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(img => img.url)
    }
  }

  async findOne(term: string) {
    let productExist: Product;
    if (isUUID(term)) {
      productExist = await this.productRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      productExist = await queryBuilder.where(`UPPER(title) =:title or slug =:slug`, {
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
    if (!productExist) throw new NotFoundException(`Product '${term}' not found`);
    return productExist;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...dataUpdated } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...dataUpdated,
    })
    if (!product) new NotFoundException(`Product whit ${id} not found`);
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(
          img => this.productImageRepository.create({ url: img })
        )
      }
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.handleDBExceptions(error)
    }
  }

  async remove(id: string) {
    const productExist = await this.findOne(id)
    await this.productRepository.remove(productExist);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)
    console.log(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error.detail)
    }
  }

}
