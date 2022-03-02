import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { AVAILABLE_LANGUAGE_DE } from '../../constants';
import { AG_GRID_LOCALE_DE } from '../constants/locale-de';
import { AG_GRID_LOCALE_EN } from '../constants/locale-en';
import { AgGridLocale } from '../models/ag-grid-locale.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  locale$: Observable<AgGridLocale>;
  constructor(private readonly translocoService: TranslocoService) {
    this.locale$ = this.translocoService.langChanges$.pipe(
      map((activeLang) => {
        if (activeLang === AVAILABLE_LANGUAGE_DE.id) {
          return AG_GRID_LOCALE_DE;
        }

        return AG_GRID_LOCALE_EN;
      })
    );
  }
}
