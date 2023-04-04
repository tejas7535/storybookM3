export const QuotationDetailsTableValidationService = {
  isOrderQuantityInvalid(orderQuantity: number, deliveryUnit: number): boolean {
    // order quantity needs to be a multiple of delivery unit
    return !deliveryUnit ? false : orderQuantity % deliveryUnit !== 0;
  },
};
