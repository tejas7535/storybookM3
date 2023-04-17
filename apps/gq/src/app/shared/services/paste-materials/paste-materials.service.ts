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

const INDEX_MATERIAL_NUMBER = 0;
const INDEX_QUANTITY = 1;
const INDEX_TARGET_PRICE = 2;

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
      const parsedQuantity = this.getParsedQuantity(el[INDEX_QUANTITY]);
      const parsedTargetPrice = this.getParsedTargetPrice(
        el[INDEX_TARGET_PRICE]
      );

      return {
        materialNumber: el[INDEX_MATERIAL_NUMBER].trim(),
        quantity: parsedQuantity > 0 ? parsedQuantity : 0,
        targetPrice: parsedTargetPrice > 0 ? parsedTargetPrice : undefined,
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

  /**
   * parses the target price from string to floated number
   *
   * @param targetPrice target price expected without thousands separator
   * @returns returns the target price parsed as floated number
   */
  private getParsedTargetPrice(targetPrice: string): number {
    if (!targetPrice) {
      return undefined;
    }

    // it is expected to paste a number in the format the localization is set within the app
    const localeTargetPrice =
      this.translocoLocaleService.getLocale() === LOCALE_DE.id
        ? targetPrice.replace(/\./g, Keyboard.EMPTY).replace(/,/g, Keyboard.DOT)
        : targetPrice.replace(/,/g, Keyboard.EMPTY);

    return Number.parseFloat(localeTargetPrice);
  }

  private removeEmptyLines(text: string): string[][] {
    return this.splitByTabs(text).filter(
      (el) =>
        (el[INDEX_MATERIAL_NUMBER] && el[INDEX_MATERIAL_NUMBER].length > 0) ||
        (el[INDEX_QUANTITY] && el[INDEX_QUANTITY].length > 0)
    );
  }

  private splitByTabs(text: string): string[][] {
    return this.splitByLines(text).map((el) => el.split('\t'));
  }

  private splitByLines(text: string): string[] {
    return text.split(/\r?\n/);
  }
}
