import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { ITooltipParams, ValueFormatterParams } from 'ag-grid-enterprise';

import {
  AG_GRID_LOCALE_BR,
  AG_GRID_LOCALE_CN,
  AG_GRID_LOCALE_DE,
  AG_GRID_LOCALE_EN,
  AG_GRID_LOCALE_ES,
  AG_GRID_LOCALE_FR,
  AG_GRID_LOCALE_IT,
} from '../ag-grid/grid-locale';

@Injectable({
  providedIn: 'root',
})
export class AgGridLocalizationService {
  private readonly langMapping: { [key: string]: typeof AG_GRID_LOCALE_DE } = {
    de: AG_GRID_LOCALE_DE,
    en: AG_GRID_LOCALE_EN,
    es: AG_GRID_LOCALE_ES,
    fr: AG_GRID_LOCALE_FR,
    it: AG_GRID_LOCALE_IT,
    pt: AG_GRID_LOCALE_BR,
    zh: AG_GRID_LOCALE_CN,
  };

  public lang: Signal<{ [key: string]: string }>;

  public constructor(
    private readonly translocoLocaleService: TranslocoLocaleService,
    private readonly translocoService: TranslocoService
  ) {
    this.lang = toSignal(
      this.translocoService.langChanges$.pipe(
        map((activeLang) => this.langMapping[activeLang] || AG_GRID_LOCALE_EN)
      )
    );
  }

  public numberFormatter = (
    params: ValueFormatterParams | ITooltipParams,
    maximumFractionDigits?: number
  ) => {
    if (!params.value && Number.parseInt(params.value, 10) !== 0) {
      return '';
    }

    return this.translocoLocaleService.localizeNumber(
      params.value,
      'decimal',
      this.translocoLocaleService.getLocale(),
      maximumFractionDigits === undefined
        ? {}
        : {
            maximumFractionDigits,
          }
    );
  };

  public dateFormatter = (params: ValueFormatterParams | ITooltipParams) => {
    if (!params.value) {
      return '';
    }

    return this.translocoLocaleService.localizeDate(
      new Date(params.value),
      this.translocoLocaleService.getLocale(),
      { day: '2-digit', month: '2-digit', year: 'numeric' }
    );
  };
}
