import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { DataService } from '../../../../shared/data.service';
import { Page } from '../../../../shared/models/page.model';
import {
  loadSalesSummary,
  loadSalesSummaryFailure,
  loadSalesSummarySuccess,
} from '../../actions';
import { SalesSummary } from '../../reducers/sales-summary/models/sales-summary.model';
import { SalesSummaryState } from '../../reducers/sales-summary/sales-summary.reducer';

@Injectable()
export class SalesSummaryEffects {
  /**
   * Effect to fetch sales summary data
   */
  loadSalesSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSalesSummary.type),
      concatMap(() =>
        this.dataService.getSalesSummary().pipe(
          map((salesSummaryPage: Page<SalesSummary>) =>
            loadSalesSummarySuccess({ salesSummaryPage })
          ),
          catchError((_e) => of(loadSalesSummaryFailure()))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly dataService: DataService,
    protected readonly store: Store<SalesSummaryState>
  ) {}
}
