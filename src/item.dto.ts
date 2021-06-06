import { Item } from './item.entity';
import { PartialType } from '@nestjs/mapped-types';

export class ItemDto extends PartialType(Item) {}
