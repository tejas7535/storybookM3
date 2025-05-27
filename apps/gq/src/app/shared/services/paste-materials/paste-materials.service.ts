/* eslint-disable @typescript-eslint/no-unused-expressions */
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { ProcessCaseFacade } from '@gq/core/store/process-case';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { parseNullableLocalizedInputValue } from '@gq/shared/utils/misc.utils';
import { roundToTwoDecimals } from '@gq/shared/utils/pricing.utils';
import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { AVAILABLE_LANGUAGES, LOCALE_DE } from '../../constants';
import { Keyboard } from '../../models';
import { MaterialTableItem, ValidationDescription } from '../../models/table';

const INDEX_MATERIAL_NUMBER = 0;
const INDEX_CUSTOMER_MATERIAL = 1;
const INDEX_QUANTITY = 2;
const INDEX_TARGET_PRICE = 3;
const INDEX_PRICE_SOURCE = 4;

@Injectable({
  providedIn: 'root',
})
export class PasteMaterialsService {
  private readonly createCaseFacade: CreateCaseFacade =
    inject(CreateCaseFacade);
  private readonly processCaseFacade: ProcessCaseFacade =
    inject(ProcessCaseFacade);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  public async onPasteStart(isCaseView: boolean): Promise<void> {
    const text = await navigator.clipboard.readText().catch((_error) => {
      this.snackBar.open(translate(`shared.snackBarMessages.pasteDisabled`));

      return '';
    });
    if (text.length > 0) {
      const linesArray = this.removeEmptyLines(text);

      const tableArray = this.processInput(linesArray);

      isCaseView
        ? this.createCaseFacade.addRowDataItems(tableArray)
        : this.processCaseFacade.addItemsToMaterialTable(tableArray);
    }
  }

  private processInput(linesArray: string[][]): MaterialTableItem[] {
    return linesArray.map((el) => {
      const quantity = this.getQuantity(el[INDEX_QUANTITY]);
      const targetPrice = this.getTargetPrice(el[INDEX_TARGET_PRICE]);
      const targetPriceSource = this.getTargetPriceSourceFromText(
        el[INDEX_PRICE_SOURCE],
        targetPrice
      );

      return {
        materialNumber: el[INDEX_MATERIAL_NUMBER].trim(),
        customerMaterialNumber: el[INDEX_CUSTOMER_MATERIAL]?.trim(),
        quantity,
        targetPrice,
        targetPriceSource,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      };
    });
  }

  /**
   * gets the quantity (localized)
   *
   * @param pasteFromClipBoardLine the line to extract the quantity
   * @returns returns the parsed quantity when it is greater than 0, otherwise 0
   */
  private getQuantity(quantity: string) {
    const parsedQuantity = this.getParsedQuantity(quantity);

    return parsedQuantity > 0 ? parsedQuantity : 0;
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

  /**
   * gets the target price (localized)
   *
   * @param pasteFromClipBoardLine line to extract the target price
   * @returns the parsed target price when it is greater than 0, otherwise undefined
   */
  private getTargetPrice(targetPrice: string): number {
    const roundedTargetPrice = roundToTwoDecimals(
      parseNullableLocalizedInputValue(
        targetPrice,
        this.translocoLocaleService.getLocale()
      )
    );

    return roundedTargetPrice > 0 ? roundedTargetPrice : undefined;
  }
  private getTargetPriceSourceFromText(
    targetPriceSource: string,
    targetPrice: number
  ): TargetPriceSource {
    if (!targetPrice) {
      return undefined;
    }
    const internalTranslations = this.getTranslationsForTargetPriceSource(
      TargetPriceSource.INTERNAL
    );
    const customerTranslations = this.getTranslationsForTargetPriceSource(
      TargetPriceSource.CUSTOMER
    );

    const targetPriceSourceLowerCase = targetPriceSource?.trim().toLowerCase();
    if (internalTranslations.includes(targetPriceSourceLowerCase)) {
      return TargetPriceSource.INTERNAL;
    }
    if (customerTranslations.includes(targetPriceSourceLowerCase)) {
      return TargetPriceSource.CUSTOMER;
    }

    return TargetPriceSource.INTERNAL;
  }

  private getTranslationsForTargetPriceSource(
    targetPriceSource: TargetPriceSource
  ): string[] {
    const language_ids = AVAILABLE_LANGUAGES.map((lang) => lang.id);
    // providing the language ids to the translate function did not have an effect but return always the value for the language configured in the app
    // getting all translations is achieved by providing all translations in the json files using the parameter lang to get the correct translation
    // check the translation file for the setup

    return language_ids.map((lang) =>
      translate(
        `shared.caseMaterial.addEntry.targetPriceSource.valuesForPaste.${targetPriceSource}`,
        { lang }
      ).toLowerCase()
    );
  }

  /**
   * will ignore lines, when minimum requested Values are not present
   * @param text the line to check
   * @returns the pasted string array without empty lines
   */
  private removeEmptyLines(text: string): string[][] {
    return this.splitByTabs(text).filter((el) => {
      const materialNumber = el[INDEX_MATERIAL_NUMBER]?.length > 0;
      const customerMaterial = el[INDEX_CUSTOMER_MATERIAL]?.length > 0;

      const quantity = el[INDEX_QUANTITY]?.length > 0;

      return materialNumber || customerMaterial || quantity;
    });
  }

  private splitByTabs(text: string): string[][] {
    return this.splitByLines(text).map((el) => el.split('\t'));
  }

  private splitByLines(text: string): string[] {
    return text.split(/\r?\n/);
  }
}
