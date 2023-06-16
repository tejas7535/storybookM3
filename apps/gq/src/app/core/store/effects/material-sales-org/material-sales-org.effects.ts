import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import {
  loadMaterialSalesOrg,
  loadMaterialSalesOrgFailure,
  loadMaterialSalesOrgSuccess,
} from '../../actions';
import { RouterStateUrl } from '../../reducers';

@Injectable()
export class MaterialSalesOrgEffect {
  triggerMaterialSalesOrgs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter((routerState: RouterStateUrl) =>
        routerState.url.includes(`${AppRoutePath.DetailViewPath}`)
      ),
      map((routerState) =>
        loadMaterialSalesOrg({
          gqPositionId: routerState.queryParams['gqPositionId'],
        })
      )
    );
  });

  loadMaterialSalesOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMaterialSalesOrg.type),
      map((action: any) => action.gqPositionId),
      mergeMap((gqPositionId: string) =>
        this.quotationDetailsService.getMaterialStatus(gqPositionId).pipe(
          map((materialSalesOrg: MaterialSalesOrg) =>
            loadMaterialSalesOrgSuccess({ materialSalesOrg })
          ),
          catchError((errorMessage) =>
            of(loadMaterialSalesOrgFailure({ errorMessage }))
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
