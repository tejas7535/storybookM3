import { Injectable } from '@angular/core';

import { catchError, EMPTY, map, mergeMap, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { FilterService } from '../../../../filter-section/filter.service';
import { IdValue, SelectedFilter } from '../../../../shared/models';
import { loadUserSettingsDimensionData } from '../../../../user-settings/store/actions/user-settings.action';
import {
  filterDimensionSelected,
  filterSelected,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../actions';
import { getSelectedBusinessArea, getSelectedTimeRange } from '../../selectors';

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
      concatLatestFrom(() => this.store.select(getSelectedBusinessArea)),
      mergeMap(([action, selectedBusinessArea]) => {
        return selectedBusinessArea
          ? of(
              filterSelected({
                filter: {
                  name: action.filterDimension,
                  idValue: selectedBusinessArea,
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
      map((filter) => filterSelected({ filter: filter.filter }))
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly filterService: FilterService
  ) {}
}
