import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

  @ApiProperty({
    default: 10,
    description: 'Limit for products in pagination.'
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'Offset for products in pagination.'
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;

}
