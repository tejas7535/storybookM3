import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { AddToCartEvent, CartItem } from './types';

@Injectable({ providedIn: 'root' })
export class AddToCartService {
  private readonly cartEvents$$ = new Subject<AddToCartEvent>();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly cartEvents$ = this.cartEvents$$.asObservable();

  public addToCart(item: CartItem[]): void {
    this.cartEvents$$.next({ cart: item });
  }
}
