/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { addRowDataItems } from '@gq/core/store/actions/create-case/create-case.actions';
import { ProcessCaseActions } from '@gq/core/store/process-case';
import { parseNullableLocalizedInputValue } from '@gq/shared/utils/misc.utils';
import { roundToTwoDecimals } from '@gq/shared/utils/pricing.utils';
import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
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
            ProcessCaseActions.addNewItemsToMaterialTable({
              items: tableArray,
            })
          );
    }
  }

  private processInput(linesArray: string[][]): MaterialTableItem[] {
    return linesArray.map((el) => {
      const parsedQuantity = this.getParsedQuantity(el[INDEX_QUANTITY]);
      const parsedAndRoundedTargetPrice = roundToTwoDecimals(
        parseNullableLocalizedInputValue(
          el[INDEX_TARGET_PRICE],
          this.translocoLocaleService.getLocale()
        )
      );

      return {
        materialNumber: el[INDEX_MATERIAL_NUMBER].trim(),
        quantity: parsedQuantity > 0 ? parsedQuantity : 0,
        targetPrice:
          parsedAndRoundedTargetPrice > 0
            ? parsedAndRoundedTargetPrice
            : undefined,
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
        ? quantity.replaceAll('.', Keyboard.EMPTY)
        : quantity.replaceAll(',', Keyboard.EMPTY);

    return Number.parseInt(localeQuantity.trim(), 10);
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
