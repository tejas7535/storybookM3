export interface AddToCartEventPayload {
  cart: CartItem[];
}

export interface CartItem {
  productCode: string;
  packCode?: string;
  quantity: number;
}
