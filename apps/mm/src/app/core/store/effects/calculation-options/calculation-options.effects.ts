import { Injectable } from '@angular/core';

import { map, mergeMap, of, switchMap } from 'rxjs';

import { RestService } from '@mm/core/services';
import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { PreflightDataParserService } from '@mm/core/services/preflght-data-parser/preflight-data-parser.service';
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
        this.calculationSelectionFacade.getCurrentStep$(),
      ]),
      switchMap(([_action, bearing, bearingSeatId, currentStep]) => {
        const typeId = bearing?.type?.typeId;
        const bearingId = bearing?.bearingId;
        const seriesId = bearing?.series?.seriesId;
        const seatId = bearingSeatId;

        const body: PreflightRequestBody = {
          IDCO_DESIGNATION: bearingId,
          RSY_BEARING_TYPE: typeId,
          RSY_BEARING_SERIES: seriesId,
          IDMM_BEARING_SEAT: seatId,
        };

        return this.restService.getBearingPreflightResponse(body).pipe(
          mergeMap((preflightOptions) => {
            const options: PreflightData =
              this.preflightDataParserService.formatPreflightData(
                preflightOptions
              );

            return currentStep === 4
              ? of(
                  CalculationOptionsActions.setCalculationOptions({ options }),
                  CalculationResultActions.calculateResult()
                )
              : of(
                  CalculationOptionsActions.setCalculationOptions({ options })
                );
          })
        );
      })
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
