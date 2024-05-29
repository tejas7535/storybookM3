import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { getSelectedSectorGpsdFromCreateCase } from '../selectors/create-case/create-case.selector';
import { SectorGpsdActions } from './sector-gpsd.actions';

const SGPSD_KEY = 'sectorGpsd';

export interface SectorGpsdState {
  sectorGpsds: SectorGpsd[];
  sectorGpsdLoading: boolean;
  errorMessage: string;
}

export const initialState: SectorGpsdState = {
  sectorGpsds: undefined,
  sectorGpsdLoading: false,
  errorMessage: undefined,
};

export const sectorGpsdFeature = createFeature({
  name: SGPSD_KEY,
  reducer: createReducer(
    initialState,
    on(
      SectorGpsdActions.getAllSectorGpsds,
      (state: SectorGpsdState): SectorGpsdState => ({
        ...state,
        sectorGpsdLoading: true,
      })
    ),
    on(
      SectorGpsdActions.getAllSectorGpsdsSuccess,
      (state: SectorGpsdState, { sectorGpsds }): SectorGpsdState => ({
        ...state,
        sectorGpsds,
        sectorGpsdLoading: false,
      })
    ),
    on(
      SectorGpsdActions.getAllSectorGpsdsFailure,
      (state: SectorGpsdState, { errorMessage }): SectorGpsdState => ({
        ...state,
        sectorGpsds: [],
        sectorGpsdLoading: false,
        errorMessage,
      })
    ),
    on(
      SectorGpsdActions.resetAllSectorGpsds,
      (_state: SectorGpsdState): SectorGpsdState => ({
        ...initialState,
      })
    )
  ),
  extraSelectors: () => {
    const getSelectedSectorGpsd = createSelector(
      getSelectedSectorGpsdFromCreateCase,
      (sectorGpsd: SectorGpsd) => sectorGpsd
    );

    return { getSelectedSectorGpsd };
  },
});
