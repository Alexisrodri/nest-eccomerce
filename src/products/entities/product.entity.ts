import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./index";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: 'products'
})
export class Product {

  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-8dca3ca79cf0',
    description: 'Product Id',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Product T-shirt',
    description: 'Product title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty(
    {
      example: '0.0',
      description: 'Product price',
    }
  )
  @Column('float', {
    default: 0
  })
  price: number

  @ApiProperty(
    {
      example: 'Description of product.',
      description: 'Product Description',
    }
  )
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty(
    {
      example: 't-shirt',
      description: 'Product slug for seo',
      uniqueItems: true
    }
  )
  @Column('text', {
    unique: true
  })
  slug: string

  @ApiProperty(
    {
      example: 10,
      description: 'Product stock',
      default: 0
    }
  )
  @Column('int', {
    default: 0
  })
  stock: number;

  @ApiProperty(
    {
      example: ['M', 'XL', 'XXL'],
      description: 'Product Sizes',
    }
  )
  @Column('text', {
    array: true
  })
  sizes: string[];

  @ApiProperty(
    {
      example: 'MEN',
      description: 'Product Gender',
      uniqueItems: true
    }
  )
  @Column('text')
  gender: string;

  @ApiProperty(
    {
      example: 'shirt',
      description: 'Product tags',
    }
  )
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    {
      cascade: true,
      eager: true,
    }
  )
  images?: ProductImage[];

  @ApiProperty()
  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
  user: User

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '_')
  }

  @BeforeUpdate()
  checkSlug() {
    this.slug = this.slug
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '_')
  }

}
