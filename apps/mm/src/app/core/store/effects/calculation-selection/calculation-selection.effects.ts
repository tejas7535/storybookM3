/* eslint-disable max-lines */
/* eslint-disable arrow-body-style */
import { inject, Injectable } from '@angular/core';

import { from, of } from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  map,
  mergeMap,
  switchMap,
} from 'rxjs/operators';

import { RestService } from '@mm/core/services';
import { StepType } from '@mm/shared/constants/steps';
import { BearingOption } from '@mm/shared/models';
import { StepManagerService } from '@mm/shared/services/step-manager/step-manager.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { CalculationOptionsActions } from '../../actions';
import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { CalculationOptionsFacade } from '../../facades/calculation-options/calculation-options.facade';
import { CalculationResultFacade } from '../../facades/calculation-result.facade';
import { CalculationSelectionFacade } from '../../facades/calculation-selection/calculation-selection.facade';
import { GlobalFacade } from '../../facades/global/global.facade';
import { Bearing } from '../../models/calculation-selection-state.model';

@Injectable()
export class CalculationSelectionEffects {
  private readonly actions$ = inject(Actions);
  private readonly restService = inject(RestService);
  private readonly calculationSelectionFacade = inject(
    CalculationSelectionFacade
  );
  private readonly calculationOptionsFacade = inject(CalculationOptionsFacade);
  private readonly calculationResultFacade = inject(CalculationResultFacade);
  private readonly stepManagerService = inject(StepManagerService);
  private readonly globalFacade = inject(GlobalFacade);

  public searchBearing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.searchBearingList),
      map((action) => action.query),
      mergeMap((query: string) => {
        return this.restService.searchBearings(query).pipe(
          map((resultList: BearingOption[]) => {
            return CalculationSelectionActions.searchBearingSuccess({
              resultList,
            });
          }),
          catchError(() =>
            of(
              CalculationSelectionActions.searchBearingSuccess({
                resultList: [],
              })
            )
          )
        );
      })
    );
  });

  public setCurrentStep$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CalculationSelectionActions.setCurrentStep),
        distinctUntilChanged(
          (previous, current) => previous.step === current.step
        ),
        concatLatestFrom(() => [
          this.calculationSelectionFacade.getCurrentStep$(),
        ]),
        map(([{ isBackNavigation }, currentStep]) => {
          if (!isBackNavigation) {
            history.pushState({ step: currentStep }, '', window.location.href);
          }
        })
      );
    },
    { dispatch: false }
  );

  public fetchBearingData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.fetchBearingData),
      concatLatestFrom(() => [
        this.calculationSelectionFacade.bearingResultList$,
        this.globalFacade.appDeliveryEmbedded$,
      ]),
      concatMap(([action, bearingResultList, isEmbedded]) => {
        const selectedBearing = bearingResultList?.find(
          (bearing) => bearing.id === action.bearingId
        );

        if (!selectedBearing) {
          // Scenario when bearing was provided via component input, eg. embedded version
          return from([
            CalculationSelectionActions.fetchBearingDetails({
              bearingId: action.bearingId,
            }),
          ]);
        }

        const isThermalBearing = selectedBearing.isThermal;
        const nextStepType = isThermalBearing
          ? this.getNextStepTypeForThermalBearing()
          : this.getNextStepTypeForNonThermalBearing();

        const bearing = {
          bearingId: selectedBearing.id,
          title: selectedBearing.title,
          isThermal: selectedBearing.isThermal,
          isMechanical: selectedBearing.isMechanical,
          isHydraulic: selectedBearing.isHydraulic,
        };

        const stepConfig = this.stepManagerService.getStepConfiguration({
          bearing,
          isAxialBearing: false,
          isEmbedded,
        });
        const nextStepIndex = stepConfig.stepIndices[nextStepType];

        const baseActions = this.createBaseActions(bearing, nextStepIndex);

        return this.generateActionsForStepType(
          nextStepType,
          baseActions,
          bearing
        );
      })
    );
  });

  public fetchBearingDetails$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.fetchBearingDetails),
      switchMap(({ bearingId }) =>
        this.restService.fetchBearingInfo(bearingId).pipe(
          map((bearing) =>
            CalculationSelectionActions.fetchBearingDetailsSuccess(bearing)
          ),
          catchError((error) => {
            console.error(
              `Failed to fetch bearing details for ${bearingId}:`,
              error
            );

            return of(
              CalculationSelectionActions.fetchBearingDetailsFailure({
                bearingId,
                error: error.message ?? 'Failed to fetch bearing details',
              })
            );
          })
        )
      )
    );
  });

  public fetchBearingDetailsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.fetchBearingDetailsSuccess),
      concatLatestFrom(() => [this.globalFacade.appDeliveryEmbedded$]),
      concatMap(
        ([
          { bearingId, title, isThermal, isMechanical, isHydraulic },
          isEmbedded,
        ]) => {
          const nextStepType = isThermal
            ? this.getNextStepTypeForThermalBearing()
            : this.getNextStepTypeForNonThermalBearing();

          const bearing = {
            bearingId,
            title,
            isThermal,
            isMechanical,
            isHydraulic,
          };
          const stepConfig = this.stepManagerService.getStepConfiguration({
            bearing,
            isAxialBearing: false,
            isEmbedded,
          });
          const nextStepIndex = stepConfig.stepIndices[nextStepType];

          const baseActions = this.createBaseActions(bearing, nextStepIndex);

          return this.generateActionsForStepType(
            nextStepType,
            baseActions,
            bearing
          );
        }
      )
    );
  });

  public fetchBearingSeats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.fetchBearingSeats),
      concatLatestFrom(() => [this.calculationSelectionFacade.getBearing$()]),
      switchMap(([_action, bearing]) => {
        return this.restService.getBearingSeats(bearing.bearingId).pipe(
          mergeMap((bearingSeats) => {
            return of(
              CalculationSelectionActions.setBearingSeats({ bearingSeats })
            );
          })
        );
      })
    );
  });

  public setBearingSeat$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.setBearingSeat),
      concatLatestFrom(() => [this.calculationSelectionFacade.getBearing$()]),
      switchMap(([_action, bearing]) => {
        // For thermal bearings, skip measurement methods and go directly to mounting methods
        const fetchAction = bearing?.isThermal
          ? CalculationSelectionActions.fetchMountingMethods()
          : CalculationSelectionActions.fetchMeasurementMethods();

        return of(
          CalculationResultActions.resetCalculationResult(),
          fetchAction
        );
      })
    );
  });

  public fetchMeasurementMethods$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.fetchMeasurementMethods),
      concatLatestFrom(() => [
        this.calculationSelectionFacade.getBearing$(),
        this.calculationSelectionFacade.getBearingSeatId$(),
      ]),
      switchMap(([_action, bearing, _bearingSeatId]) => {
        return this.restService.getMeasurementMethods(bearing?.bearingId).pipe(
          mergeMap((measurementMethods) => {
            return of(
              CalculationSelectionActions.setMeasurementMethods({
                measurementMethods,
              })
            );
          })
        );
      })
    );
  });

  public setMeasurementMethods$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.setMeasurementMethods),
      switchMap((action) => {
        const measurementMethods = action.measurementMethods;

        if (measurementMethods.length === 1) {
          return of(
            CalculationSelectionActions.setMeasurementMethod({
              measurementMethod: measurementMethods[0].id,
            }),
            CalculationSelectionActions.fetchMountingMethods()
          );
        }

        return of();
      })
    );
  });

  public setMeasurementMethod$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.setMeasurementMethod),
      switchMap((_action) => {
        return of(
          CalculationSelectionActions.fetchMountingMethods(),
          CalculationResultActions.resetCalculationResult()
        );
      })
    );
  });

  public fetchMountingMethods$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.fetchMountingMethods),
      concatLatestFrom(() => [
        this.calculationSelectionFacade.getBearing$(),
        this.calculationSelectionFacade.getBearingSeatId$(),
        this.calculationSelectionFacade.getMeasurementMethod$(),
      ]),
      switchMap(([_action, bearing, bearingSeatId, measurementMethodId]) => {
        const mountingMethodsObservable = bearing?.isThermal
          ? this.restService.getThermalBearingMountingMethods(bearing.bearingId)
          : this.restService.getNonThermalBearingMountingMethods(
              bearing?.bearingId,
              bearingSeatId,
              measurementMethodId
            );

        return mountingMethodsObservable.pipe(
          mergeMap((mountingMethods) => {
            return of(
              CalculationSelectionActions.setMountingMethods({
                mountingMethods,
              })
            );
          })
        );
      })
    );
  });

  public updateMountingMethodAndCurrentStep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.updateMountingMethodAndCurrentStep),
      concatLatestFrom(() => [
        this.calculationSelectionFacade.getBearing$(),
        this.calculationSelectionFacade.isAxialDisplacement$(),
        this.globalFacade.appDeliveryEmbedded$,
      ]),
      switchMap(([{ mountingMethod }, bearing, isAxialBearing, isEmbedded]) => {
        const stepConfig = this.stepManagerService.getStepConfiguration({
          bearing,
          isAxialBearing,
          isEmbedded,
        });

        const nextStepIndex = (() => {
          const hasCalculationOptionsStep =
            isAxialBearing || bearing?.isThermal;

          return hasCalculationOptionsStep
            ? stepConfig.stepIndices[StepType.CALCULATION_OPTIONS]
            : stepConfig.stepIndices[StepType.RESULT];
        })();

        const baseActions = [
          CalculationSelectionActions.setMountingMethod({
            mountingMethod,
          }),
          CalculationResultActions.resetCalculationResult(),
          CalculationSelectionActions.setCurrentStep({
            step: nextStepIndex,
          }),
        ];

        // All bearings need preflight options (even normal bearings for calculation)
        // For thermal bearings, don't fetch preflight options as they have different behavior
        const actions = bearing?.isThermal
          ? baseActions
          : [...baseActions, CalculationOptionsActions.fetchPreflightOptions()];

        return of(...actions);
      })
    );
  });

  updateStepConfiguration$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        CalculationSelectionActions.setBearing,
        CalculationSelectionActions.setBearingSeat,
        CalculationSelectionActions.setMeasurementMethod,
        CalculationSelectionActions.setMountingMethod
      ),
      concatLatestFrom(() => [
        this.calculationSelectionFacade.getBearing$(),
        this.calculationSelectionFacade.isAxialDisplacement$(),
        this.calculationSelectionFacade.getBearingSeatId$(),
        this.calculationSelectionFacade.getMountingMethod$(),
        this.calculationOptionsFacade.getCalculationPerformed$(),
        this.calculationResultFacade.isResultAvailable$,
        this.globalFacade.appDeliveryEmbedded$,
      ]),
      map(
        ([
          _action,
          bearing,
          isAxialBearing,
          bearingSeatId,
          mountingMethod,
          optionsCalculationPerformed,
          resultAvailable,
          isEmbedded,
        ]) => {
          if (!bearing) {
            return { type: 'NO_OP' };
          }
          const stepConfig = this.stepManagerService.getStepConfiguration({
            bearing,
            isAxialBearing,
            isEmbedded,
            completionState: {
              bearingSeatId,
              mountingMethod,
              optionsCalculationPerformed,
              isResultAvailable: resultAvailable,
            },
          });

          return CalculationSelectionActions.updateStepConfiguration({
            stepConfiguration: stepConfig,
          });
        }
      )
    );
  });

  private getNextStepTypeForThermalBearing(): StepType {
    return StepType.MEASURING_MOUNTING;
  }

  private getNextStepTypeForNonThermalBearing(): StepType {
    return StepType.BEARING_SEAT;
  }

  private createBaseActions(bearing: Bearing, stepIndex: number) {
    return [
      CalculationSelectionActions.setBearing({
        bearingId: bearing.bearingId,
        title: bearing.title,
        isThermal: bearing.isThermal,
        isMechanical: bearing.isMechanical,
        isHydraulic: bearing.isHydraulic,
      }),
      CalculationResultActions.resetCalculationResult(),
      CalculationOptionsActions.resetCalculationOptions(),
      CalculationSelectionActions.setCurrentStep({
        step: stepIndex,
      }),
      CalculationResultActions.fetchBearinxVersions(),
    ];
  }

  private generateActionsForStepType(
    nextStepType: StepType,
    baseActions: any[],
    bearing?: Bearing
  ) {
    if (nextStepType === StepType.BEARING_SEAT) {
      return from([
        ...baseActions.slice(0, 4),
        CalculationSelectionActions.fetchBearingSeats(),
        baseActions[4],
      ]);
    } else if (nextStepType === StepType.MEASURING_MOUNTING) {
      const fetchAction = bearing?.isThermal
        ? CalculationSelectionActions.fetchMountingMethods()
        : CalculationSelectionActions.fetchMeasurementMethods();

      return from([...baseActions.slice(0, 4), fetchAction, baseActions[4]]);
    }

    return from(baseActions);
  }
}
