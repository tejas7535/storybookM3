/* eslint-disable @typescript-eslint/member-ordering */
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { of } from 'rxjs';
import { catchError, mergeMap, switchMap, takeUntil } from 'rxjs/operators';

import { RestService } from '@mm/core/services';
import { BearinxOnlineResult } from '@mm/core/services/bearinx-result.interface';
import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { ReportParserService } from '@mm/core/services/report-parser/report-parser.service';
import { PROPERTIES } from '@mm/shared/constants/tracking-names';
import { CalculationRequestPayload } from '@mm/shared/models/calculation-request.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationOptionsFacade } from '../../facades/calculation-options/calculation-options.facade';
import { CalculationSelectionFacade } from '../../facades/calculation-selection/calculation-selection.facade';
import { CalculationResult } from '../../models/calculation-result-state.model';
import { Bearing } from '../../models/calculation-selection-state.model';

@Injectable()
export class CalculationResultEffects {
  private readonly actions$ = inject(Actions);
  private readonly restService = inject(RestService);
  private readonly reportParserService = inject(ReportParserService);
  private readonly calculationSelectionFacade = inject(
    CalculationSelectionFacade
  );
  private readonly calculationOptionsFacade = inject(CalculationOptionsFacade);
  private readonly applicationInsightsService = inject(
    ApplicationInsightsService
  );

  public calculateResult$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationResultActions.calculateResult),
      concatLatestFrom(() => [
        this.calculationSelectionFacade.getBearing$(),
        this.calculationSelectionFacade.getBearingSeatId$(),
        this.calculationSelectionFacade.getMeasurementMethod$(),
        this.calculationSelectionFacade.getMountingMethod$(),

        this.calculationOptionsFacade.getOptions$(),
      ]),
      switchMap(
        ([
          _action,
          bearing,
          seatId,
          measurementMethod,
          mountingMethod,
          options,
        ]) => {
          const requestPayload = this.createCalculationRequestPayload(
            bearing,
            seatId,
            measurementMethod,
            mountingMethod,
            options
          );

          this.applicationInsightsService.logEvent(PROPERTIES, requestPayload);

          return this.restService
            .getBearingCalculationResult(requestPayload)
            .pipe(
              mergeMap((data: BearinxOnlineResult) => {
                const calculationResult: CalculationResult =
                  this.reportParserService.parseResponse(data);

                return of(
                  CalculationResultActions.setCalculationResult({
                    result: calculationResult,
                  })
                );
              }),
              catchError((_error: HttpErrorResponse) => {
                return of(
                  CalculationResultActions.calculateResultFailure({
                    error: _error.error.detail,
                  })
                );
              })
            );
        }
      )
    );
  });

  public fetchBearinxVersion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationResultActions.fetchBearinxVersions),
      switchMap(() =>
        this.restService.getBearinxVersions().pipe(
          takeUntil(
            // cancel request if action is called again
            this.actions$.pipe(
              ofType(CalculationResultActions.fetchBearinxVersions)
            )
          ),
          switchMap((versions) => [
            CalculationResultActions.setBearinxVersions({ versions }),
          ]),
          catchError(() => of(CalculationResultActions.unsetBearinxVersions()))
        )
      )
    );
  });

  private createCalculationRequestPayload(
    bearing: Bearing,
    seatId: string,
    measurementMethod: string,
    mountingMethod: string,
    options: PreflightData
  ): CalculationRequestPayload {
    return {
      IDCO_DESIGNATION: bearing.bearingId,
      IDMM_BEARING_SEAT: seatId,
      IDMM_CLEARANCE_REDUCTION_INPUT: options.mountingOption,
      IDMM_HYDRAULIC_NUT_TYPE: options.hudraulicNutType.value,
      IDMM_INNER_RING_EXPANSION: options.innerRingExpansion,
      IDMM_INNER_SHAFT_DIAMETER: options.shaftDiameter,
      IDMM_MEASSURING_METHOD: measurementMethod,
      IDMM_MODULUS_OF_ELASTICITY: options.modulusOfElasticity,
      IDMM_MOUNTING_METHOD: mountingMethod,
      IDMM_NUMBER_OF_PREVIOUS_MOUNTINGS: options.numberOfPreviousMountings,
      IDMM_POISSON_RATIO: options.poissonRatio,
      IDMM_RADIAL_CLEARANCE_REDUCTION: options.radialClearanceReduction,
      IDMM_SHAFT_MATERIAL: options.shaftMaterial,
    };
  }
}
