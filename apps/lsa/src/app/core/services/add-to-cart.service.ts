import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AccessoryTableFormGroup } from '@lsa/recommendation/result/accessory-table/accessory-table.model';
import { UserTier } from '@lsa/shared/constants/user-tier.enum';
import { Accessory } from '@lsa/shared/models';

import {
  AddToCartService,
  CartItem,
} from '@schaeffler/engineering-apps-behaviors/medias';

@Injectable({
  providedIn: 'root',
})
export class LSACartService {
  private userTier: UserTier = UserTier.Anonymous;

  constructor(private readonly cartService: AddToCartService) {}

  public setUserTier(userTier: UserTier): void {
    this.userTier = userTier;
  }

  public getUserTier(): UserTier {
    return this.userTier;
  }

  public shouldShowPrices(): boolean {
    return this.getUserTier() === UserTier.Business;
  }

  public addToCartEvent(
    accessories: Accessory[],
    formGroup: AccessoryTableFormGroup
  ): void {
    const updatedAccessories = this.updateAccessoriesQuantity(
      accessories,
      formGroup
    );

    const cartItems = this.createCartItems(updatedAccessories);
    this.cartService.addToCart(cartItems);
  }

  private updateAccessoriesQuantity(
    accessories: Accessory[],
    formGroup: AccessoryTableFormGroup
  ): Accessory[] {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key) as FormGroup<{
        [key: string]: FormControl<number>;
      }>;

      Object.keys(control.controls).forEach((subKey) => {
        const accessory = accessories.find(
          (acc) => acc.fifteen_digit === subKey
        );

        if (accessory) {
          accessory.qty = control.get(subKey)?.value;
        }
      });
    });

    return accessories;
  }

  private createCartItems(accessories: Accessory[]): CartItem[] {
    return accessories.map((acc) => ({
      productCode: acc.pim_code,
      packCode: this.getPackCode(acc.fifteen_digit),
      quantity: acc.qty,
    }));
  }

  private getPackCode(fifteen_digit: string): string | undefined {
    if (this.userTier !== UserTier.Business) {
      return undefined;
    }

    return fifteen_digit.slice(-2);
  }
}
