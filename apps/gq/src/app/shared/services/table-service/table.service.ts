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
/**
 *  Table Service
 */
export class TableService {
  static pasteItems(
    items: MaterialTableItem[],
    currentRowData: MaterialTableItem[]
  ): MaterialTableItem[] {
    let updatedRowData = [];

    // remove '-' from all items
    const transformedItems = items.map((item) => ({
      ...item,
      materialNumber: item.materialNumber.replace(/-/g, ''),
    }));

    //
    const index = currentRowData.length - 1;

    updatedRowData =
      index >= 0 ? [...currentRowData, ...transformedItems] : transformedItems;

    // Remove duplicates
    const res = updatedRowData.filter(
      (item, pos, self) =>
        self.findIndex(
          (of) =>
            of.materialNumber === item.materialNumber &&
            of.quantity === item.quantity
        ) === pos
    );

    return res;
  }

  static deleteItem(
    materialNumber: string,
    quantity: number,
    rowData: MaterialTableItem[]
  ): MaterialTableItem[] {
    const filteredRowData = rowData.filter(
      (it) =>
        !(it.materialNumber === materialNumber && it.quantity === quantity)
    );

    return filteredRowData.length > 0 ? filteredRowData : [];
  }

  static validateData(
    el: MaterialTableItem,
    materialValidations: MaterialValidation[]
  ): MaterialTableItem {
    const updatedRow = { ...el };

    // Check for valid materialNumber
    const validation = materialValidations.find(
      (item) => item.materialNumber15 === el.materialNumber
    );
    const valid = validation ? validation.valid : false;
    updatedRow.info = {
      valid,
      description: valid
        ? []
        : TableService.addDesc(
            updatedRow.info.description,
            ValidationDescription.MaterialNumberInValid
          ),
    };

    const quantity =
      typeof updatedRow.quantity === 'number'
        ? updatedRow.quantity > 0
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
            ? parseInt(el.quantity, 10)
            : el.quantity,
      };
    });
  }
}
