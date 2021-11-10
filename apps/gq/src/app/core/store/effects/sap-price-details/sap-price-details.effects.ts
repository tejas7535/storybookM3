import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { DetailRoutePath } from '../../../../detail-view/detail-route-path.enum';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import {
  loadSapPriceDetails,
  loadSapPriceDetailsFailure,
  loadSapPriceDetailsSuccess,
} from '../../actions';
import { RouterStateUrl } from '../../reducers';
import { SapPriceDetail } from '../../reducers/sap-price-details/models/sap-price-detail.model';

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
          map((sapPriceDetails: SapPriceDetail[]) =>
            loadSapPriceDetailsSuccess({ sapPriceDetails })
          ),
          catchError((errorMessage) =>
            of(loadSapPriceDetailsFailure({ errorMessage }))
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
