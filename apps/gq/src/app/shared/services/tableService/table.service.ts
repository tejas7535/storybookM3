import { Injectable } from '@angular/core';

import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../../core/store/models';
import {
  dummyRowData,
  isDummyData,
} from '../../../core/store/reducers/create-case/config/dummy-row-data';

@Injectable({
  providedIn: 'root',
})
/**
 *  Table Service
 */
export class TableService {
  static pasteItems(
    items: MaterialTableItem[],
    pasteDestination: MaterialTableItem,
    currentRowData: MaterialTableItem[]
  ): MaterialTableItem[] {
    let updatedRowData = [];
    const currentRowDataFiltered = currentRowData.filter(
      (el) => !isDummyData(el)
    );

    const index = currentRowData.findIndex(
      (value) =>
        pasteDestination &&
        value.materialNumber === pasteDestination.materialNumber &&
        value.quantity === pasteDestination.quantity
    );

    updatedRowData =
      index >= 0
        ? [...currentRowDataFiltered.slice(0, index + 1), ...items]
        : currentRowData;

    // Remove duplicates
    return updatedRowData.filter(
      (item, pos, self) =>
        self.findIndex(
          (of) =>
            of.materialNumber === item.materialNumber &&
            of.quantity === item.quantity
        ) === pos
    );
  }

  static deleteItem(
    materialNumber: string,
    rowData: MaterialTableItem[]
  ): MaterialTableItem[] {
    const filteredRowData = rowData.filter(
      (it) => it.materialNumber !== materialNumber
    );

    return filteredRowData.length > 0 ? filteredRowData : [dummyRowData];
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
    // Check for valid quantity
    const parsedQuantity =
      typeof updatedRow.quantity === 'string'
        ? parseInt(updatedRow.quantity.trim(), 10)
        : updatedRow.quantity;

    const quantity =
      typeof parsedQuantity === 'number'
        ? parsedQuantity > 0
          ? parsedQuantity
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
}
