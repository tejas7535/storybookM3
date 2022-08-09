import { Injectable } from '@angular/core';

import { catchError, EMPTY, map, mergeMap, Observable, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { FilterService } from '../../../../filter-section/filter.service';
import { IdValue } from '../../../../shared/models';
import { loadUserSettingsOrgUnits } from '../../../../user-settings/store/actions/user-settings.action';
import {
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../actions';
import { FilterDimension as FilterDimension } from '../../reducers/filter/filter.reducer';
import { getSelectedTimeRange } from '../../selectors';

@Injectable()
export class FilterEffects {
  loadFilterDimensionData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFilterDimensionData, loadUserSettingsOrgUnits),
      concatLatestFrom(() => this.store.select(getSelectedTimeRange)),
      mergeMap(([action, timeRange]) =>
        this.getDataForFilterDimension(
          action.filterDimension,
          action.searchFor,
          timeRange.id
        ).pipe(
          map((items: IdValue[]) =>
            loadFilterDimensionDataSuccess({
              filterDimension: action.filterDimension,
              items,
            })
          ),
          catchError((error) =>
            of(loadFilterDimensionDataFailure({ errorMessage: error.message }))
          )
        )
      )
    );
  });

  getDataForFilterDimension(
    filterDimension: FilterDimension,
    searchFor?: string,
    timeRangeId?: string
  ): Observable<IdValue[]> {
    switch (filterDimension) {
      case FilterDimension.ORG_UNITS:
        return this.filterService.getOrgUnits(searchFor, timeRangeId);

      case FilterDimension.REGIONS:
        return this.filterService.getRegions();

      case FilterDimension.SUB_REGIONS:
        return this.filterService.getSubRegions();

      case FilterDimension.COUNTRIES:
        return this.filterService.getCountries();

      case FilterDimension.SUB_FUNCTIONS:
        return this.filterService.getSubFunctions();

      default:
        return EMPTY;
    }
  }

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly filterService: FilterService
  ) {}
}
