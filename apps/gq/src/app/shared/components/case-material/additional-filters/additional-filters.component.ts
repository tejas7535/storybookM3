import { Component, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { provideTranslocoScope, TranslocoService } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { FilterSelectionComponent } from './filter-selection/filter-selection.component';

@Component({
  selector: 'gq-additional-filters',
  templateUrl: './additional-filters.component.html',
  imports: [
    FilterSelectionComponent,
    LoadingSpinnerModule,
    PushPipe,
    SharedTranslocoModule,
    LetDirective,
  ],
  providers: [provideTranslocoScope('additional-filters')],
})
export class AdditionalFiltersComponent {
  private readonly createCaseFacade: CreateCaseFacade =
    inject(CreateCaseFacade);
  private readonly translocoService: TranslocoService =
    inject(TranslocoService);

  plsAndSeries$ = this.createCaseFacade.getProductLinesAndSeries$;
  plsAndSeriesLoading$ = this.createCaseFacade.getProductLinesAndSeriesLoading$;

  productLineTitle$: Observable<string> = this.translocoService.selectTranslate(
    'productLines',
    {},
    'additional-filters'
  );
  seriesTitle$: Observable<string> = this.translocoService.selectTranslate(
    'series',
    {},
    'additional-filters'
  );
  gpsdGroupTitle$: Observable<string> = this.translocoService.selectTranslate(
    'gpsdGroups',
    {},
    'additional-filters'
  );

  selectProductLines(selectedProductLines: string[]) {
    this.createCaseFacade.selectProductLines(selectedProductLines);
  }
  selectSeries(selectedSeries: string[]) {
    this.createCaseFacade.selectSeries(selectedSeries);
  }
  selectGpsdGroups(selectedGpsdGroups: string[]) {
    this.createCaseFacade.selectGpsdGroups(selectedGpsdGroups);
  }
}
