/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';

import { from, of } from 'rxjs';
import { concatMap, map, mergeMap, switchMap } from 'rxjs/operators';

import { LazyListLoaderService, RestService } from '@mm/core/services';
import { environment } from '@mm/environments/environment';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { CalculationOptionsActions } from '../../actions';
import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { CalculationSelectionFacade } from '../../facades/calculation-selection/calculation-selection.facade';

@Injectable()
export class CalculationSelectionEffects {
  public searchBearing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.searchBearingList),
      map((action) => action.query),
      mergeMap((query: string) => {
        return this.restService.getBearingSearch(query).pipe(
          map((response) => {
            const resultList: any[] = response.data.map((item: string) => ({
              title: item,
              id: item,
            }));

            return CalculationSelectionActions.searchBearingSuccess({
              resultList,
            });
          })
        );
      })
    );
  });

  public fetchBearingData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.fetchBearingData),
      concatMap((action) =>
        from([
          CalculationSelectionActions.setBearing({
            bearingId: action.bearingId,
            title: action.bearingId,
          }),
          CalculationSelectionActions.setCurrentStep({ step: 1 }),
          CalculationSelectionActions.fetchBearingSeats(),
          CalculationResultActions.fetchBearinxVersions(),
        ])
      )
    );
  });

  public fetchBearingSeats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.fetchBearingSeats),
      concatLatestFrom(() => [this.calculationSelectionFacade.getBearing$()]),
      switchMap(([_action, bearing]) => {
        const url = `${environment.baseUrl}/bearings/${encodeURIComponent(bearing.bearingId)}`;

        return this.lazyListLoader.loadBearingSeatsOptions(url).pipe(
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
      switchMap((_action) => {
        return of(CalculationSelectionActions.fetchMeasurementMethods());
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
        const bearingId = encodeURIComponent(bearing?.bearingId);

        const url = `${environment.baseUrl}/bearings/${bearingId}/measuringmethods`;

        return this.lazyListLoader.loadOptions(url).pipe(
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
        return of(CalculationSelectionActions.fetchMountingMethods());
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
        const bearingId = encodeURIComponent(bearing?.bearingId);
        const seatId = bearingSeatId;
        const methodId = measurementMethodId;

        const url = `${environment.baseUrl}/bearings/${bearingId}/seats/${seatId}/measuringmethods/${methodId}/mountingmethods`;

        return this.lazyListLoader.loadOptions(url).pipe(
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
        this.calculationSelectionFacade.getMeasurementMethod$(),
      ]),
      switchMap(([action, measurementMethod]) => {
        const nextStep = measurementMethod === 'LB_AXIAL_DISPLACEMENT' ? 3 : 4;

        return of(
          CalculationSelectionActions.setMountingMethod({
            mountingMethod: action.mountingMethod,
          }),
          CalculationSelectionActions.setCurrentStep({ step: nextStep }),
          CalculationOptionsActions.fetchPreflightOptions()
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly restService: RestService,
    private readonly calculationSelectionFacade: CalculationSelectionFacade,
    private readonly lazyListLoader: LazyListLoaderService
  ) {}
}
