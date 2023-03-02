import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import {
  setSelectedGpsdGroups,
  setSelectedProductLines,
  setSelectedSeries,
} from '@gq/core/store/actions';
import { PLsAndSeries } from '@gq/core/store/reducers/models';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-additional-filters',
  templateUrl: './additional-filters.component.html',
})
export class AdditionalFiltersComponent {
  @Input() plsAndSeries: PLsAndSeries;
  @Input() plsAndSeriesLoading: boolean;

  productLineTitle$: Observable<string>;
  seriesTitle$: Observable<string>;
  gpsdGroupTitle$: Observable<string>;

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
    this.gpsdGroupTitle$ = this.translocoService.selectTranslate(
      'caseCreation.createCustomerCase.additionalMaterials.gpsdGroups',
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
  selectGpsdGroups(selectedGpsdGroups: string[]) {
    this.store.dispatch(setSelectedGpsdGroups({ selectedGpsdGroups }));
  }
}
