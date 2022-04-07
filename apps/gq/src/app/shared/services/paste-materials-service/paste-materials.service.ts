/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  pasteRowDataItems,
  pasteRowDataItemsToAddMaterial,
} from '../../../core/store';
import { ValidationDescription } from '../../models/table';

@Injectable({
  providedIn: 'root',
})
export class PasteMaterialsService {
  public constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {}

  public async onPasteStart(isCaseView: boolean): Promise<void> {
    const text = await navigator.clipboard.readText().catch((_error) => {
      this.snackBar.open(translate(`shared.snackBarMessages.pasteDisabled`));

      return '';
    });
    if (text.length > 0) {
      const linesArray = this.removeEmptyLines(text);

      const tableArray = this.processInput(linesArray);
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

  private processInput(linesArray: string[][]) {
    return linesArray.map((el) => {
      const parsedQuantity = this.checkForValidQuantity(el);

      return {
        materialNumber: el[0].trim(),
        quantity: parsedQuantity > 0 ? parsedQuantity : 0,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      };
    });
  }

  private checkForValidQuantity(el: string[]) {
    return el[1] ? Number.parseInt(el[1].trim(), 10) : 0;
  }

  private removeEmptyLines(text: string): string[][] {
    return this.splitByTabs(text).filter(
      (el) => (el[0] && el[0].length > 0) || (el[1] && el[1].length > 0)
    );
  }

  private splitByTabs(text: string): string[][] {
    return this.splitByLines(text).map((el) => el.split('\t'));
  }

  private splitByLines(text: string): string[] {
    return text.split(/\r?\n/);
  }
}
