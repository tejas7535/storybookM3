import { Injectable } from '@angular/core';

import { catchError, EMPTY, map, mergeMap, Observable, of } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { FilterService } from '../../../../filter-section/filter.service';
import {
  FilterDimension,
  IdValue,
  SelectedFilter,
} from '../../../../shared/models';
import { loadUserSettingsOrgUnits } from '../../../../user-settings/store/actions/user-settings.action';
import {
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

  getDataForFilterDimension(
    filterDimension: string,
    searchFor?: string,
    timeRangeId?: string
  ): Observable<IdValue[]> {
    switch (filterDimension) {
      case FilterDimension.ORG_UNIT:
        return this.filterService.getOrgUnits(searchFor, timeRangeId);

      case FilterDimension.REGION:
        return this.filterService.getRegions();

      case FilterDimension.SUB_REGION:
        return this.filterService.getSubRegions();

      case FilterDimension.COUNTRY:
        return this.filterService.getCountries();

      case FilterDimension.FUNCTION:
        return this.filterService.getFunctions();

      case FilterDimension.SUB_FUNCTION:
        return this.filterService.getSubFunctions();

      case FilterDimension.SEGMENT:
        return this.filterService.getSegments();

      case FilterDimension.SUB_SEGMENT:
        return this.filterService.getSubSegments();

      case FilterDimension.SEGMENT_UNIT:
        return this.filterService.getSegmentUnits();

      case FilterDimension.BOARD:
        return this.filterService.getBoards();

      case FilterDimension.SUB_BOARD:
        return this.filterService.getSubBoards();

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
