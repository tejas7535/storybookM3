import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import { RouterStateUrl } from '../../reducers';
import {
  loadMaterialAlternativeCosts,
  loadMaterialAlternativeCostsFailure,
  loadMaterialAlternativeCostsSuccess,
} from '../../actions';
import { MaterialAlternativeCost } from '../../../../shared/models/quotation-detail/material-alternative-cost.model';

@Injectable()
export class MaterialAlternativeCostEffect {
  triggerLoadMaterialAlternativeCosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter((routerState: RouterStateUrl) =>
        routerState.url.includes(`${AppRoutePath.DetailViewPath}`)
      ),
      map((routerState) =>
        loadMaterialAlternativeCosts({
          gqPositionId: routerState.queryParams['gqPositionId'],
        })
      )
    );
  });

  loadMaterialAlternativeCosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMaterialAlternativeCosts.type),
      map((action: any) => action.gqPositionId),
      mergeMap((gqPositionId: string) =>
        this.quotationDetailsService
          .getMaterialAlternativeCosts(gqPositionId)
          .pipe(
            map((materialAlternativeCosts: MaterialAlternativeCost[]) =>
              loadMaterialAlternativeCostsSuccess({ materialAlternativeCosts })
            ),
            catchError((errorMessage) =>
              of(loadMaterialAlternativeCostsFailure({ errorMessage }))
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
