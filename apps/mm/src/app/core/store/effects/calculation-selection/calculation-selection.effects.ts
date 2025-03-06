/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { LazyListLoaderService, RestService } from '@mm/core/services';
import { environment } from '@mm/environments/environment';
import { BearingOption, SearchEntry } from '@mm/shared/models';
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
            const resultList: BearingOption[] = response.data.map(
              ({ data: { title, id } }: SearchEntry) => ({
                title,
                id,
              })
            );

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
      switchMap((action) =>
        this.restService.getBearingRelations(action.bearingId).pipe(
          mergeMap((result) => {
            const bearing = result.data.bearing.data;
            const series = result.data.series.data;
            const type = result.data.type.data;

            return of(
              CalculationSelectionActions.setBearing({
                bearingId: bearing.id,
                title: bearing.title,
              }),

              CalculationSelectionActions.setBearingType({
                typeId: type.id,
                title: type.title,
              }),

              CalculationSelectionActions.setBearingSeries({
                seriesId: series.id,
                title: series.title,
              }),

              CalculationSelectionActions.setCurrentStep({ step: 1 }),

              CalculationSelectionActions.fetchBearingSeats(),

              CalculationResultActions.fetchBearinxVersions()
            );
          })
        )
      )
    );
  });

  public fetchBearingSeats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalculationSelectionActions.fetchBearingSeats),
      concatLatestFrom(() => [this.calculationSelectionFacade.getBearing$()]),
      switchMap(([_action, bearing]) => {
        const typeId = bearing?.type?.typeId;
        const seriesId = bearing?.series?.seriesId;
        const url = `${environment.baseUrl}/bearing-types/${typeId}/series/${seriesId}/bearings/${bearing?.bearingId}`;

        return this.lazyListLoader.loadOptions(url, []).pipe(
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
      switchMap(([_action, bearing, bearingSeatId]) => {
        const typeId = bearing?.type?.typeId;
        const bearingId = bearing?.bearingId;
        const seriesId = bearing?.series?.seriesId;
        const seatId = bearingSeatId;

        const url = `${environment.baseUrl}/bearing-types/${typeId}/series/${seriesId}/bearings/${bearingId}/seats/${seatId}/measuringMethods`;

        return this.lazyListLoader.loadOptions(url, []).pipe(
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
        const typeId = bearing?.type?.typeId;
        const bearingId = bearing?.bearingId;
        const seriesId = bearing?.series?.seriesId;
        const seatId = bearingSeatId;
        const methodId = measurementMethodId;

        const url = `${environment.baseUrl}/bearing-types/${typeId}/series/${seriesId}/bearings/${bearingId}/seats/${seatId}/measuringMethods/${methodId}/mountingMethods`;

        return this.lazyListLoader.loadOptions(url, []).pipe(
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
