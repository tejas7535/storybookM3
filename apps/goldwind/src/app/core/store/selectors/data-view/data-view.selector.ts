import { createSelector } from '@ngrx/store';

import { getDataViewState } from '../../reducers';
import { DataViewState } from '../../reducers/data-view/data-view.reducer';
import { SensorData } from '../../reducers/data-view/models';
import { Interval } from '../../reducers/shared/models';

export const getDeviceId = createSelector(
  getDataViewState,
  () => 'mark-has-to-tell-me'
); // will later access a valid id within the inital bearing result

export const getDataResult = createSelector(
  getDataViewState,
  (state: DataViewState): SensorData[] => state.result
);

export const getDataInterval = createSelector(
  getDataViewState,
  (state: DataViewState): Interval => state.interval
);

export const getFrequency = createSelector(
  getDataViewState,
  (state: DataViewState): number => state.frequency
);
