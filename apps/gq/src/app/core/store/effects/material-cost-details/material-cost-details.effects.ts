import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  loadMaterialCostDetails,
  loadMaterialCostDetailsFailure,
  loadMaterialCostDetailsSuccess,
  resetMaterialCostDetails,
} from '../../actions';
import { ActiveCaseActions } from '../../active-case/active-case.action';
import {
  getQuotationCurrency,
  getSelectedQuotationDetail,
} from '../../active-case/active-case.selectors';

@Injectable()
export class MaterialCostDetailsEffects {
  loadMaterialCostDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMaterialCostDetails),
      concatLatestFrom(() => this.store.select(getQuotationCurrency)),
      mergeMap(([action, currency]) =>
        this.materialService
          .getMaterialCostDetails(
            action.productionPlantId,
            action.materialNumber15,
            currency
          )
          .pipe(
            map((materialCostDetails) =>
              loadMaterialCostDetailsSuccess({ materialCostDetails })
            ),
            catchError((errorMessage) =>
              of(loadMaterialCostDetailsFailure({ errorMessage }))
            )
          )
      )
    );
  });

  triggerLoadMaterialCostDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ActiveCaseActions.getQuotationSuccess,
        ActiveCaseActions.setSelectedQuotationDetail
      ),
      concatLatestFrom(() => this.store.select(getSelectedQuotationDetail)),
      map(([_action, quotationDetail]) => quotationDetail),
      filter((quotationDetail) => quotationDetail !== undefined),
      map((quotationDetail: QuotationDetail) => {
        if (
          quotationDetail.material?.materialNumber15 &&
          quotationDetail.productionPlant?.plantNumber !== undefined
        ) {
          return loadMaterialCostDetails({
            materialNumber15: quotationDetail.material.materialNumber15,
            productionPlantId: quotationDetail.productionPlant.plantNumber,
          });
        }

        return resetMaterialCostDetails();
      })
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly materialService: MaterialService
  ) {}
}
