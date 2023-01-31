import { Injectable } from '@angular/core';

import { catchError, EMPTY, filter, map, mergeMap, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { FilterService } from '../../../../filter-section/filter.service';
import { FilterKey, IdValue, SelectedFilter } from '../../../../shared/models';
import { loadUserSettingsDimensionData } from '../../../../user/store/actions/user.action';
import {
  filterDimensionSelected,
  filterSelected,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../actions';
import {
  getSelectedDimension,
  getSelectedDimensionIdValue,
  getSelectedTimeRange,
} from '../../selectors';

@Injectable()
export class FilterEffects {
  loadFilterDimensionData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFilterDimensionData, loadUserSettingsDimensionData),
      concatLatestFrom(() => this.store.select(getSelectedTimeRange)),
      mergeMap(([action, timeRange]) =>
        this.filterService
          .getDataForFilterDimension(
            action.filterDimension,
            action.searchFor,
            timeRange.id
          )
          .pipe(
            map((items: IdValue[]) =>
              loadFilterDimensionDataSuccess({
                filterDimension: action.filterDimension,
                items,
              })
            ),
            catchError((error) =>
              of(
                loadFilterDimensionDataFailure({
                  filterDimension: action.filterDimension,
                  errorMessage: error.message,
                })
              )
            )
          )
      )
    );
  });

  loadFilterDimensionDataSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFilterDimensionDataSuccess),
      concatLatestFrom(() => this.store.select(getSelectedDimensionIdValue)),
      mergeMap(([action, selectedDimensionIdValue]) => {
        return selectedDimensionIdValue
          ? of(
              filterSelected({
                filter: {
                  name: action.filterDimension,
                  idValue: selectedDimensionIdValue,
                } as SelectedFilter,
              })
            )
          : EMPTY;
      })
    );
  });

  filterDimensionSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(filterDimensionSelected),
      map((action) =>
        loadFilterDimensionData({ filterDimension: action.filterDimension })
      )
    );
  });

  timeRangeSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(filterSelected),
      filter((action) => action.filter.name === FilterKey.TIME_RANGE),
      concatLatestFrom(() => this.store.select(getSelectedDimension)),
      map(([_action, filterDimension]) =>
        loadFilterDimensionData({ filterDimension })
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly filterService: FilterService
  ) {}
}
