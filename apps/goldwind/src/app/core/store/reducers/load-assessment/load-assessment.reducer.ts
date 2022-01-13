import { Action, createReducer, on } from '@ngrx/store';
import { startOfDay, sub } from 'date-fns';
import { LoadAssessmentData } from '../../../http/rest.service';

import {
  getLoadAssessmentDataSuccess,
  setLoadAssessmentDisplay,
  setLoadAssessmentInterval,
} from '../../actions/load-assessment/load-assessment.actions';
import { LoadAssessmentDisplay } from './models';

export interface LoadAssessmentState {
  result: LoadAssessmentData[];
  display: LoadAssessmentDisplay;
  interval: {
    startDate: number;
    endDate: number;
  };
}

export const initialState: LoadAssessmentState = {
  result: [],
  display: {
    centerLoadFx: true,
    centerLoadFy: true,
    centerLoadFz: true,
    centerLoadMy: true,
    centerLoadMz: true,
    lsp01Strain: true,
    lsp02Strain: true,
    lsp03Strain: true,
    lsp04Strain: true,
    lsp05Strain: true,
    lsp06Strain: true,
    lsp07Strain: true,
    lsp08Strain: true,
    lsp09Strain: true,
    lsp10Strain: true,
    lsp11Strain: true,
    lsp12Strain: true,
    lsp13Strain: true,
    lsp14Strain: true,
    lsp15Strain: true,
    lsp16Strain: true,
  },
  interval: {
    startDate: Math.floor(+startOfDay(sub(new Date(), { days: 1 })) / 1000),
    endDate: Math.floor(Date.now() / 1000),
  },
};

export const loadAssessmentReducer = createReducer(
  initialState,
  on(
    setLoadAssessmentDisplay,
    (
      state: LoadAssessmentState,
      { loadAssessmentDisplay }
    ): LoadAssessmentState => ({
      ...state,
      display: loadAssessmentDisplay,
    })
  ),
  on(
    setLoadAssessmentInterval,
    (state: LoadAssessmentState, { interval }): LoadAssessmentState => ({
      ...state,
      interval,
    })
  ),
  on(
    getLoadAssessmentDataSuccess,
    (state: LoadAssessmentState, { data }): LoadAssessmentState => ({
      ...state,
      result: data,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: LoadAssessmentState,
  action: Action
): LoadAssessmentState {
  return loadAssessmentReducer(state, action);
}
