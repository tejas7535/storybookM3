import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { MaterialComparableCost } from '@gq/shared/models/quotation-detail/material-comparable-cost.model';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import {
  loadMaterialComparableCosts,
  loadMaterialComparableCostsFailure,
  loadMaterialComparableCostsSuccess,
} from '../../actions';
import { RouterStateUrl } from '../../reducers';

@Injectable()
export class MaterialComparableCostEffect {
  triggerLoadMaterialComparableCosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter((routerState: RouterStateUrl) =>
        routerState.url.includes(`${AppRoutePath.DetailViewPath}`)
      ),
      map((routerState) =>
        loadMaterialComparableCosts({
          gqPositionId: routerState.queryParams['gqPositionId'],
        })
      )
    );
  });

  loadMaterialComparableCosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMaterialComparableCosts.type),
      map((action: any) => action.gqPositionId),
      mergeMap((gqPositionId: string) =>
        this.quotationDetailsService
          .getMaterialComparableCosts(gqPositionId)
          .pipe(
            map((materialComparableCosts: MaterialComparableCost[]) =>
              loadMaterialComparableCostsSuccess({
                materialComparableCosts,
              })
            ),
            catchError((errorMessage) =>
              of(loadMaterialComparableCostsFailure({ errorMessage }))
            )
          )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly quotationDetailsService: QuotationDetailsService
  ) {}
}
