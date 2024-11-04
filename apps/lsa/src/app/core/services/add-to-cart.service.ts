import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';

import { AccessoryTableFormGroup } from '@lsa/recommendation/result/accessory-table/accessory-table.model';
import { UserTier } from '@lsa/shared/constants/user-tier.enum';
import { Accessory, AddToCartEventPayload, CartItem } from '@lsa/shared/models';

@Injectable({
  providedIn: 'root',
})
export class AddToCartService {
  private readonly addToCartEventSubject$ =
    new Subject<AddToCartEventPayload>();

  private userTier: UserTier = UserTier.Anonymous;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public addToCartEvent$ = this.addToCartEventSubject$.asObservable();

  public setUserTier(userTier: UserTier): void {
    this.userTier = userTier;
  }

  public addToCartEvent(
    accessories: Accessory[],
    formGroup: AccessoryTableFormGroup
  ): void {
    const updatedAccessories = this.updateAccessoriesQuantity(
      accessories,
      formGroup
    );

    const cartItems = this.createCartItmems(updatedAccessories);
    this.addToCartEventSubject$.next({ cart: cartItems });
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

  private createCartItmems(accessories: Accessory[]): CartItem[] {
    return accessories.map((acc) => ({
      productCode: acc.matnr,
      packCode: this.getPackCode(acc.fifteen_digit),
      quantity: acc.qty,
    }));
  }

  private getPackCode(fifteen_digit: string): string | undefined {
    if (this.userTier !== UserTier.Business) {
      return undefined;
    }

    return this.getLastTwoDigits(fifteen_digit);
  }

  private getLastTwoDigits(input: string): string {
    return input.slice(-2);
  }
}
