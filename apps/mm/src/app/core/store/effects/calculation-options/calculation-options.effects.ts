import { Injectable } from '@angular/core';

import { map, mergeMap, of, switchMap } from 'rxjs';

import { RestService } from '@mm/core/services';
import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { PreflightDataParserService } from '@mm/core/services/preflght-data-parser/preflight-data-parser.service';
import { LB_AXIAL_DISPLACEMENT } from '@mm/shared/constants/dialog-constant';
import { PreflightRequestBody } from '@mm/shared/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { CalculationOptionsActions } from '../../actions';
import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationSelectionFacade } from '../../facades/calculation-selection/calculation-selection.facade';

@Injectable()
export class CalculationOptionsEffects {
  public fetchPreflightOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationOptionsActions.fetchPreflightOptions),
      concatLatestFrom(() => [
        this.calculationSelectionFacade.getBearing$(),
        this.calculationSelectionFacade.getBearingSeatId$(),
        this.calculationSelectionFacade.getMeasurementMethod$(),
        this.calculationSelectionFacade.getMountingMethod$(),
        this.calculationSelectionFacade.getCurrentStep$(),
      ]),
      switchMap(
        ([
          _action,
          bearing,
          bearingSeatId,
          measurementMethod,
          mountingMethod,
        ]) => {
          const bearingId = bearing?.bearingId;

          const seatId = bearingSeatId;

          const body: PreflightRequestBody = {
            IDCO_DESIGNATION: bearingId,
            IDMM_BEARING_SEAT: seatId,
            IDMM_MEASSURING_METHOD: measurementMethod,
            IDMM_MOUNTING_METHOD: mountingMethod,
          };

          return this.restService.getBearingPreflightResponse(body).pipe(
            mergeMap((preflightOptions) => {
              const options: PreflightData =
                this.preflightDataParserService.formatPreflightData(
                  preflightOptions
                );

              return measurementMethod === LB_AXIAL_DISPLACEMENT
                ? of(
                    CalculationOptionsActions.setCalculationOptions({ options })
                  )
                : of(
                    CalculationOptionsActions.setCalculationOptions({
                      options,
                    }),
                    CalculationResultActions.calculateResult()
                  );
            })
          );
        }
      )
    );
  });

  public calculateResultFromOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationOptionsActions.calculateResultFromOptions),
      switchMap(() => {
        // calculate result with updated options
        return of(CalculationResultActions.calculateResult());
      })
    );
  });

  public updateShaftMaterialInformation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationOptionsActions.updateShaftMaterialInformation),
      switchMap((action) => {
        return this.restService
          .getBearingsMaterialResponse(action.selectedOption)
          .pipe(
            map((shaftMaterialData) => {
              return CalculationOptionsActions.setShaftMaterialInformation({
                shaftMaterialData,
              });
            })
          );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly calculationSelectionFacade: CalculationSelectionFacade,
    private readonly preflightDataParserService: PreflightDataParserService
  ) {}
}
