import { FormControl, FormGroup } from '@angular/forms';

import { AccessoryTableFormGroup } from '@lsa/recommendation/result/accessory-table/accessory-table.model';
import { UserTier } from '@lsa/shared/constants/user-tier.enum';
import { Accessory } from '@lsa/shared/models';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import {
  AddToCartService,
  CartItem,
} from '@schaeffler/engineering-apps-behaviors/medias';

import { LSACartService } from './add-to-cart.service';

describe('AddToCartService', () => {
  let spectator: SpectatorService<LSACartService>;
  let service: LSACartService;
  const createService = createServiceFactory({
    service: LSACartService,
    providers: [mockProvider(AddToCartService)],
  });

  const accessories: Accessory[] = [
    {
      fifteen_digit: '123',
      matnr: '001',
      pim_code: '001',
      qty: 0,
    } as Partial<Accessory> as Accessory,
    {
      fifteen_digit: '456',
      matnr: '002',
      pim_code: '002',
      qty: 0,
    } as Partial<Accessory> as Accessory,
  ];

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should have default user tier as Anonymous', () => {
    expect(service['userTier']).toBe(UserTier.Anonymous);
  });

  describe('when setting user tier', () => {
    it('should update user tier', () => {
      service.setUserTier(UserTier.Business);
      expect(service['userTier']).toBe(UserTier.Business);
    });
  });

  describe('when user tier is different than business', () => {
    beforeEach(() => {
      service.setUserTier(UserTier.Plus);
    });

    it('should update accessories quantities and emit cart items', () => {
      const formGroup: AccessoryTableFormGroup = new FormGroup({
        group1: new FormGroup({
          '123': new FormControl(5),
          '456': new FormControl(10),
        }),
      }) as unknown as AccessoryTableFormGroup;

      const expectedCartItems: CartItem[] = [
        { productCode: '001', quantity: 5 },
        { productCode: '002', quantity: 10 },
      ];

      service.addToCartEvent(accessories, formGroup);
      expect(service['cartService'].addToCart).toHaveBeenCalledWith(
        expectedCartItems
      );
    });

    it('should return shouldShowPrices false', () => {
      expect(service.shouldShowPrices()).toEqual(false);
    });
  });

  describe('when user tier is business', () => {
    beforeEach(() => {
      service.setUserTier(UserTier.Business);
    });

    it('should update accessories quantities and emit cart items with pack codes', () => {
      const formGroup: AccessoryTableFormGroup = new FormGroup({
        group1: new FormGroup({
          '123': new FormControl(5),
          '456': new FormControl(10),
        }),
      }) as unknown as AccessoryTableFormGroup;

      const expectedCartItems: CartItem[] = [
        { productCode: '001', packCode: '23', quantity: 5 },
        { productCode: '002', packCode: '56', quantity: 10 },
      ];
      service.addToCartEvent(accessories, formGroup);
      expect(service['cartService'].addToCart).toHaveBeenCalledWith(
        expectedCartItems
      );
    });

    it('should return shouldShowPrices true', () => {
      expect(service.shouldShowPrices()).toEqual(true);
    });
  });
});
