import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { QuotationDetail } from '../../../../shared/models/quotation-detail';
import { MaterialService } from '../../../../shared/services/rest-services/material-service/material.service';
import {
  loadMaterialStock,
  loadMaterialStockFailure,
  loadMaterialStockSuccess,
  loadQuotationSuccess,
  resetMaterialStock,
  setSelectedQuotationDetail,
} from '../../actions';
import { getSelectedQuotationDetail } from '../../selectors';

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
      ofType(loadQuotationSuccess.type, setSelectedQuotationDetail.type),
      concatLatestFrom(() => this.store.select(getSelectedQuotationDetail)),
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
