import { PriceSource } from './price-source.enum';

export class UpdatePrice {
  constructor(
    public price: number,
    public priceSource: PriceSource
  ) {}
}
