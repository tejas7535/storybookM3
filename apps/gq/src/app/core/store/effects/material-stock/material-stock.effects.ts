import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import {
  loadMaterialStock,
  loadMaterialStockFailure,
  loadMaterialStockSuccess,
  resetMaterialStock,
} from '../../actions';
import { activeCaseFeature } from '../../active-case/active-case.reducer';

@Injectable()
export class MaterialStockEffects {
  loadMaterialStock$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadMaterialStock),
      mergeMap((action) =>
        this.materialService
          .getMaterialStock(action.productionPlantId, action.materialNumber15)
          .pipe(
            map((materialStock) => loadMaterialStockSuccess({ materialStock })),
            catchError((errorMessage) =>
              of(loadMaterialStockFailure({ errorMessage }))
            )
          )
      )
    );
  });

  triggerLoadMaterialStock$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ActiveCaseActions.getQuotationSuccess,
        ActiveCaseActions.setSelectedQuotationDetail
      ),
      concatLatestFrom(() =>
        this.store.select(activeCaseFeature.getSelectedQuotationDetail)
      ),
      map(([_action, quotationDetail]) => quotationDetail),
      filter((quotationDetail) => quotationDetail !== undefined),
      map((quotationDetail: QuotationDetail) => {
        if (
          quotationDetail.material?.materialNumber15 &&
          quotationDetail.productionPlant?.plantNumber !== undefined
        ) {
          return loadMaterialStock({
            materialNumber15: quotationDetail.material.materialNumber15,
            productionPlantId: quotationDetail.productionPlant.plantNumber,
          });
        }

        return resetMaterialStock();
      })
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly materialService: MaterialService
  ) {}
}
