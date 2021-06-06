import { Entity, Column } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity()
export class Item extends CommonEntity {
  @Column()
  itemName: string;

  @Column()
  image: string;

  @Column({ name: 'shipment_charge' })
  shipmentCharge: boolean;

  @Column({ name: 'discount_rate' })
  discountRate: number;

  @Column({ name: 'discounted_price', nullable: true })
  discountedPrice?: number;

  @Column()
  originalPrice: number;

  @Column()
  rating: number;
}
