import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { DetailRoutePath } from '../../../../detail-view/detail-route-path.enum';
import {
  loadExtendedSapPriceConditionDetails,
  loadExtendedSapPriceConditionDetailsFailure,
  loadExtendedSapPriceConditionDetailsSuccess,
  loadSapPriceDetails,
  loadSapPriceDetailsFailure,
  loadSapPriceDetailsSuccess,
} from '../../actions';
import { getGqId } from '../../active-case/active-case.selectors';
import { RouterStateUrl } from '../../reducers';
import {
  ExtendedSapPriceConditionDetail,
  SapPriceConditionDetail,
} from '../../reducers/models';

@Injectable()
export class SapPriceDetailsEffects {
  triggerLoadSapPriceDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter((routerState: RouterStateUrl) =>
        routerState.url.includes(
          `${AppRoutePath.DetailViewPath}/${DetailRoutePath.SapPath}`
        )
      ),
      map((routerState) =>
        loadSapPriceDetails({
          gqPositionId: routerState.queryParams['gqPositionId'],
        })
      )
    );
  });

  loadSapPriceDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadSapPriceDetails.type),
      map((action: any) => action.gqPositionId),
      mergeMap((gqPositionId: string) =>
        this.quotationDetailsService.getSapPriceDetails(gqPositionId).pipe(
          map((sapPriceDetails: SapPriceConditionDetail[]) =>
            loadSapPriceDetailsSuccess({ sapPriceDetails })
          ),
          catchError((errorMessage) =>
            of(loadSapPriceDetailsFailure({ errorMessage }))
          )
        )
      )
    );
  });

  loadExtendedSapPriceConditionDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadExtendedSapPriceConditionDetails),
      concatLatestFrom(() => this.store.select(getGqId)),
      map(([_action, gqId]) => gqId),
      mergeMap((quotationNumber: number) =>
        this.quotationDetailsService
          .getExtendedSapPriceConditionDetails(quotationNumber)
          .pipe(
            map(
              (
                extendedSapPriceConditionDetails: ExtendedSapPriceConditionDetail[]
              ) => {
                return loadExtendedSapPriceConditionDetailsSuccess({
                  extendedSapPriceConditionDetails:
                    extendedSapPriceConditionDetails.sort(
                      (a, b) => a.sequenceId - b.sequenceId
                    ),
                });
              }
            ),
            catchError((errorMessage) =>
              of(loadExtendedSapPriceConditionDetailsFailure({ errorMessage }))
            )
          )
      )
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly quotationDetailsService: QuotationDetailsService
  ) {}
}
