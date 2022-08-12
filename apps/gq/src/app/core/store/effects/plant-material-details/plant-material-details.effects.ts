import { Injectable } from '@angular/core';

import { catchError, filter, map, mergeMap, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  PlantMaterialDetail,
  QuotationDetail,
} from '../../../../shared/models/quotation-detail';
import { MaterialService } from '../../../../shared/services/rest-services/material-service/material.service';
import { getSelectedQuotationDetail } from '../..';
import {
  loadQuotationSuccess,
  setSelectedQuotationDetail,
} from '../../actions';
import {
  loadPlantMaterialDetails,
  loadPlantMaterialDetailsFailure,
  loadPlantMaterialDetailsSuccess,
  resetPlantMaterialDetails,
} from '../../actions/plant-material-details/plant-material-details.actions';

@Injectable()
export class PlantMaterialDetailsEffects {
  loadPlantMaterialDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadPlantMaterialDetails),
      mergeMap((action) =>
        this.materialService
          .getPlantMaterialDetails(action.materialId, action.plantIds)
          .pipe(
            map((plantMaterialDetails: PlantMaterialDetail[]) =>
              loadPlantMaterialDetailsSuccess({ plantMaterialDetails })
            ),
            catchError((errorMessage) =>
              of(loadPlantMaterialDetailsFailure({ errorMessage }))
            )
          )
      )
    );
  });

  triggerLoadPlantMaterialDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadQuotationSuccess.type, setSelectedQuotationDetail.type),
      concatLatestFrom(() => this.store.select(getSelectedQuotationDetail)),
      map(([_action, quotationDetail]) => quotationDetail),
      filter((quotationDetail) => quotationDetail !== undefined),
      map((quotationDetail: QuotationDetail) => {
        if (
          quotationDetail.material?.materialNumber15 &&
          (quotationDetail.productionPlant?.plantNumber ||
            quotationDetail.plant?.plantNumber)
        ) {
          return loadPlantMaterialDetails({
            materialId: quotationDetail.material.materialNumber15,
            plantIds: [
              quotationDetail.productionPlant?.plantNumber,
              quotationDetail.plant.plantNumber,
            ],
          });
        }

        return resetPlantMaterialDetails();
      })
    );
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly materialService: MaterialService
  ) {}
}
