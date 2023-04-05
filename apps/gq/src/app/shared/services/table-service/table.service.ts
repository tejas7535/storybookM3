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
  static updateItem(
    item: MaterialTableItem,
    data: MaterialTableItem[]
  ): MaterialTableItem[] {
    return data.map((d) => {
      if (d.id === item.id) {
        return {
          ...item,
          materialNumber: TableService.removeDashes(item.materialNumber),
        };
      }

      return d;
    });
  }

  static updateStatusOnCustomerChanged(
    currentRowData: MaterialTableItem[]
  ): MaterialTableItem[] {
    return [
      ...currentRowData.map((item: MaterialTableItem) => {
        const newItem: MaterialTableItem = {
          ...item,
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
        quantity:
          typeof el.quantity === 'string'
            ? Number.parseInt(el.quantity, 10)
            : el.quantity,
      };
    });
  }
}
