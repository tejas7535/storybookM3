/* eslint-disable no-prototype-builtins */
import { BomItem } from '../models';

/*
 * this utility method can be removed when the odata bom is the new default.
 */
export const addCostShareOfParent = (
  item: BomItem,
  selectedItem: BomItem
): BomItem =>
  item.hasOwnProperty('totalPricePerPc') &&
  selectedItem.hasOwnProperty('totalPricePerPc')
    ? {
        ...item,
        costShareOfParent: item.totalPricePerPc / selectedItem.totalPricePerPc,
      }
    : item;
