import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productServices: ProductsService
  ) { }

  async runSeed() {
    await this.inserNewProducts();
    return `Seed executed`
  }

  private async inserNewProducts() {
    await this.productServices.deleteAllProducts();
    const seedProducts = initialData.products;
    const insertPromises = []
    seedProducts.map(product => {
      insertPromises.push(
        this.productServices.create(product)
      )
    })
    await Promise.all(insertPromises);

    return true;
  }

}
