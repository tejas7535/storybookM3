import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  setSelectedProductLines,
  setSelectedSeries,
} from '../../../../core/store';
import { PLsAndSeries } from '../../../../core/store/reducers/create-case/models/pls-and-series.model';

@Component({
  selector: 'gq-additional-filters',
  templateUrl: './additional-filters.component.html',
})
export class AdditionalFiltersComponent {
  @Input() plsAndSeries: PLsAndSeries;
  @Input() plsAndSeriesLoading: boolean;

  productLineTitle$: Observable<string>;
  seriesTitle$: Observable<string>;
  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {
    this.productLineTitle$ = this.translocoService.selectTranslate(
      'caseCreation.createCustomerCase.additionalMaterials.productLines',
      {},
      'case-view'
    );
    this.seriesTitle$ = this.translocoService.selectTranslate(
      'caseCreation.createCustomerCase.additionalMaterials.series',
      {},
      'case-view'
    );
  }

  selectProductLines(selectedProductLines: string[]) {
    this.store.dispatch(setSelectedProductLines({ selectedProductLines }));
  }
  selectSeries(selectedSeries: string[]) {
    this.store.dispatch(setSelectedSeries({ selectedSeries }));
  }
}
