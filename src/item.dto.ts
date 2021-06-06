import { Item } from './item.entity';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class ItemDto extends PartialType(Item) {
  @ApiProperty()
  itemName: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  shipmentCharge: boolean;
  @ApiProperty()
  discountRate: number;
  @ApiProperty()
  listingPrice: number;
  @ApiProperty()
  originalPrice: number;
  @ApiProperty()
  rating: number;
}
