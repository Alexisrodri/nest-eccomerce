import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage, Product } from './entities/index';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    AuthModule,
  ],
  exports: [ProductsService]
})
export class ProductsModule { }
