import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productServices: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUser()
    await this.inserNewProducts(adminUser);
    return `Seed executed`
  }

  private async insertUser() {

    const userSeed = initialData.users;
    const users: User[] = [];
    userSeed.forEach(user => {
      users.push(this.userRepository.create(user))
    });
    const dbUsers = await this.userRepository.save(userSeed);
    return dbUsers[0];
  }

  private async deleteTables() {
    await this.productServices.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async inserNewProducts(user: User) {
    await this.productServices.deleteAllProducts();
    const seedProducts = initialData.products;
    const insertPromises = []
    seedProducts.map(product => {
      insertPromises.push(
        this.productServices.create(product, user)
      )
    })
    await Promise.all(insertPromises);

    return true;
  }

}
