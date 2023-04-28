import { Injectable } from '@angular/core';

import {
  MaterialQuantities,
  MaterialValidation,
  ValidationDescription,
} from '../../models/table';
import { MaterialTableItem } from '../../models/table/material-table-item-model';
@Injectable({
  providedIn: 'root',
})
export class TableService {
  static addItems(
    items: MaterialTableItem[],
    currentRowData: MaterialTableItem[]
  ): MaterialTableItem[] {
    const newId = TableService.generateNewTableItemId(currentRowData);

    // remove '-' from all items
    const transformedItems = items.map((item, i) => ({
      ...item,
      id: newId + i,
      materialNumber: TableService.removeDashes(
        item.materialNumber.replace(/-/g, '')
      ),
    }));

    return [...currentRowData, ...transformedItems];
  }

  static duplicateItem(
    itemId: number,
    currentItems: MaterialTableItem[]
  ): MaterialTableItem[] {
    const newId = TableService.generateNewTableItemId(currentItems);
    const itemIndex = currentItems.findIndex((e) => e.id === itemId);

    if (itemIndex >= 0) {
      currentItems.splice(itemIndex + 1, 0, {
        ...currentItems[itemIndex],
        id: newId,
      });
    }

    return currentItems;
  }

  static generateNewTableItemId(currentItems: MaterialTableItem[]): number {
    return currentItems.length > 0
      ? Math.max(...currentItems.map((e) => e.id)) + 1
      : 0;
  }
  /**
   * updates the item with given data
   * @param item the updated item
   * @param data the data within store
   * @param resetValidation if true, info property is reset to not_validated because a validation will follow
   * @returns list of all materials with updated items
   */
  static updateItem(
    item: MaterialTableItem,
    data: MaterialTableItem[],
    resetValidation: boolean
  ): MaterialTableItem[] {
    return data.map((d) => {
      if (d.id === item.id) {
        return resetValidation
          ? {
              // validation needs to be triggered (--> will return UoM and priceUnit and ValidationStatus)
              // action for validation is to be triggered manually by the component that decides whether to validate or not
              // matDesc or matNumber have been changed,validation is reset
              ...item,
              info: {
                valid: false,
                description: [ValidationDescription.Not_Validated],
                errorCode: undefined,
              },
            }
          : {
              // matDesc || matNumber have NOT been changed, validation values will not change so use currency and UoM from existing item of store
              ...item,
              currency: d.currency,
              priceUnit: d.priceUnit,
              UoM: d.UoM,
            };
      }

      return d;
    });
  }

  static updateStatusAndCurrencyOnCustomerOrSalesOrgChanged(
    currentRowData: MaterialTableItem[],
    currency?: string
  ): MaterialTableItem[] {
    return [
      ...currentRowData.map((item: MaterialTableItem) => {
        const newItem: MaterialTableItem = {
          ...item,
          currency,
          info: {
            valid: false,
            errorCode: undefined,
            description: [ValidationDescription.Not_Validated],
          },
        };

        return newItem;
      }),
    ];
  }
  static deleteItem(
    id: number,
    rowData: MaterialTableItem[]
  ): MaterialTableItem[] {
    const filteredRowData = rowData.filter((it) => !(it.id === id));

    return filteredRowData.length > 0 ? filteredRowData : [];
  }

  static validateData(
    el: MaterialTableItem,
    materialValidation: MaterialValidation
  ): MaterialTableItem {
    const updatedRow = { ...el };
    updatedRow.materialDescription = materialValidation?.materialDescription;

    const valid = materialValidation ? materialValidation.valid : false;
    updatedRow.info = {
      valid,
      description: valid
        ? []
        : TableService.addDesc(
            updatedRow.info.description,
            ValidationDescription.MaterialNumberInValid
          ),
    };

    if (materialValidation?.errorCode) {
      updatedRow.info.errorCode = materialValidation.errorCode;
    }

    updatedRow.priceUnit = materialValidation?.materialPriceUnit;
    updatedRow.UoM = materialValidation?.materialUoM;

    const quantity =
      typeof updatedRow.quantity === 'number'
        ? // eslint-disable-next-line unicorn/no-nested-ternary
          updatedRow.quantity > 0
          ? updatedRow.quantity
          : false
        : false;

    if (!quantity) {
      updatedRow.info.valid = false;
      updatedRow.info.description = TableService.addDesc(
        updatedRow.info.description,
        ValidationDescription.QuantityInValid
      );
    } else {
      // Covers an edge case, to convert f.e quantity 50* into 50 (* = wildcard)
      updatedRow.quantity = quantity;
    }

    if (updatedRow.info.description.length === 0) {
      updatedRow.info.description = TableService.addDesc(
        updatedRow.info.description,
        ValidationDescription.Valid
      );
    }

    return updatedRow;
  }

  private static addDesc(
    description: ValidationDescription[],
    add: ValidationDescription
  ): ValidationDescription[] {
    if (add === ValidationDescription.Valid) {
      return [ValidationDescription.Valid];
    }
    if (description[0] === ValidationDescription.Not_Validated) {
      return [add];
    }
    if (description.includes(add)) {
      return description;
    }

    return [...description, add];
  }

  static removeDashes(text: string): string {
    return text.replace(/-/g, '');
  }

  static removeDashesFromTableItems(
    items: MaterialTableItem[]
  ): MaterialTableItem[] {
    return items.map((it) => ({
      ...it,
      materialNumber: TableService.removeDashes(it.materialNumber),
    }));
  }

  static createMaterialQuantitiesFromTableItems(
    rowData: MaterialTableItem[],
    itemId: number
  ): MaterialQuantities[] {
    let startItemId = itemId;

    return rowData.map((el) => {
      startItemId += 10;

      return {
        quotationItemId: startItemId,
        materialId: el.materialNumber,
        targetPrice: el.targetPrice
          ? el.targetPrice / (el.priceUnit ?? 1)
          : undefined,
        quantity:
          typeof el.quantity === 'string'
            ? Number.parseInt(el.quantity, 10)
            : el.quantity,
      };
    });
  }

  /**
   * add the customers currency to the material table items
   *
   * @param materialItems materialItems to be added
   * @param customerCurrency the currency of the customer
   * @returns the list with all materialItems including currency when target price is present
   */
  static addCurrencyToMaterialItems = (
    materialItems: MaterialTableItem[],
    customerCurrency: string
  ): MaterialTableItem[] =>
    materialItems.map((item: MaterialTableItem) =>
      item.targetPrice ? { ...item, currency: customerCurrency } : item
    );

  /**
   * add the customers currency to the material table item
   */
  static addCurrencyToMaterialItem = (
    materialItem: MaterialTableItem,
    customerCurrency: string
  ): MaterialTableItem =>
    materialItem.targetPrice
      ? { ...materialItem, currency: customerCurrency }
      : materialItem;
}
