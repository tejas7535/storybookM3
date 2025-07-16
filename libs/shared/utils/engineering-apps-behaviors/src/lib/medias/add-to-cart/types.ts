import { MediasID } from '../../types';

export interface CartItem {
  productCode: MediasID;
  packCode?: string;
  quantity: number;
}

export interface AddToCartEvent {
  cart: CartItem[];
}
