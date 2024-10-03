import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger()

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      if (!createProductDto.slug) {
        createProductDto.slug = createProductDto.title.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '')
      }
      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [data, count] = await this.productRepository.findAndCount({
      take: limit,
      skip: offset,
    });
    return { count, data }
  }

  async findOne(term: string) {
    let productExist: Product;
    if (isUUID(term)) {
      productExist = await this.productRepository.findOneBy({ id: term })
    } else {
      productExist = await this.productRepository.findOneBy({ slug: term })
    }
    // const productExist = await this.productRepository.findOneBy({ term })
    if (!productExist) throw new NotFoundException(`Product '${term}' not found`);
    return productExist;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const productExist = await this.findOne(id)
    await this.productRepository.remove(productExist);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.details)
    }
    this.logger.error(error)
    // console.log(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

}
