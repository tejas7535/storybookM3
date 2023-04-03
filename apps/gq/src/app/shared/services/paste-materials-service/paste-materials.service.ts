/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { addRowDataItems } from '@gq/core/store/actions/create-case/create-case.actions';
import { addMaterialRowDataItems } from '@gq/core/store/actions/process-case/process-case.action';
import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';

import { LOCALE_DE } from '../../constants';
import { Keyboard } from '../../models';
import { MaterialTableItem, ValidationDescription } from '../../models/table';

@Injectable({
  providedIn: 'root',
})
export class PasteMaterialsService {
  public constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly translocoLocaleService: TranslocoLocaleService
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
            addRowDataItems({
              items: tableArray,
            })
          )
        : this.store.dispatch(
            addMaterialRowDataItems({
              items: tableArray,
            })
          );
    }
  }

  private processInput(linesArray: string[][]): MaterialTableItem[] {
    return linesArray.map((el) => {
      const parsedQuantity = this.getParsedQuantity(el[1]);

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

  private getParsedQuantity(quantity: string): number {
    if (!quantity) {
      return 1;
    }
    const localeQuantity =
      this.translocoLocaleService.getLocale() === LOCALE_DE.id
        ? quantity.replace(/\./g, Keyboard.EMPTY)
        : quantity.replace(/,/g, Keyboard.EMPTY);

    return Number.parseInt(localeQuantity.trim(), 10);
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
