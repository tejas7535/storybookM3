import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { AddToCartService } from './add-to-cart.service';
import { CartItem } from './types';

describe('AddToCartService', () => {
  let spectator: SpectatorService<AddToCartService>;

  const createService = createServiceFactory(AddToCartService);
  beforeEach(() => {
    spectator = createService();
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should call the .next function on the subject', () => {
    const MOCK_PRODUCTS: CartItem[] = [
      {
        productCode: '1234',
        packCode: '10',
        quantity: 2,
      },
      {
        productCode: '5678',
        packCode: '10',
        quantity: 5,
      },
    ];
    const nextSpy = jest.spyOn(spectator.service['cartEvents$$'], 'next');
    spectator.service.addToCart(MOCK_PRODUCTS);
    expect(nextSpy).toHaveBeenCalledWith({ cart: MOCK_PRODUCTS });
  });
});
