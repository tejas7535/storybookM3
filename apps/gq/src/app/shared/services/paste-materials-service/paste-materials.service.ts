/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  pasteRowDataItems,
  pasteRowDataItemsToAddMaterial,
} from '../../../core/store';
import { MaterialTableItem, ValidationDescription } from '../../models/table';

@Injectable({
  providedIn: 'root',
})
export class PasteMaterialsService {
  public constructor(private readonly store: Store) {}

  public async onPasteStart(isCaseView: boolean): Promise<void> {
    const text = await navigator.clipboard.readText();
    const linesArray = text
      // split by lines
      .split(/\r?\n/)
      // split by tab
      .map((el) => el.split('\t'))
      // remove empty objects
      .filter(
        (el) => (el[0] && el[0].length > 0) || (el[1] && el[1].length > 0)
      );

    const tableArray = linesArray.map((el) => {
      // Check for valid quantity
      const parsedQuantity = el[1] ? Number.parseInt(el[1].trim(), 10) : 0;

      const item: MaterialTableItem = {
        materialNumber: el[0].trim(),
        quantity: parsedQuantity > 0 ? parsedQuantity : 0,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      };

      return item;
    });
    isCaseView
      ? this.store.dispatch(
          pasteRowDataItems({
            items: tableArray,
          })
        )
      : this.store.dispatch(
          pasteRowDataItemsToAddMaterial({
            items: tableArray,
          })
        );
  }
}
