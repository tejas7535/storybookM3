import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { QuotationDetail } from '../../../../shared/models/quotation-detail';
import { MaterialService } from '../../../../shared/services/rest-services/material-service/material.service';
import {
  loadMaterialCostDetails,
  loadMaterialCostDetailsFailure,
  loadMaterialCostDetailsSuccess,
  loadQuotationSuccess,
  resetMaterialCostDetails,
  setSelectedQuotationDetail,
} from '../../actions';
import { getSelectedQuotationDetail } from '../../selectors';

@Injectable()
export class MaterialCostDetailsEffects {
  loadMaterialCostDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMaterialCostDetails),
      mergeMap((action) =>
        this.materialService
          .getMaterialCostDetails(
            action.productionPlantId,
            action.materialNumber15
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
      ofType(loadQuotationSuccess.type, setSelectedQuotationDetail.type),
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
