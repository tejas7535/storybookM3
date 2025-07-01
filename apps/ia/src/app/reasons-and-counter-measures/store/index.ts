/* eslint-disable max-lines */
import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import { Moment } from 'moment';

import { ExitEntryEmployeesResponse } from '../../overview/models';
import { DATA_IMPORT_DAY } from '../../shared/constants';
import { filterAdapter } from '../../shared/models';
import {
  getMonth12MonthsAgo,
  getTimeRangeFromDates,
} from '../../shared/utils/utilities';
import { ReasonForLeavingTab, TextAnalysisResponse } from '../models';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import {
  loadComparedLeaversByReason,
  loadComparedReasonAnalysis,
  loadComparedReasonAnalysisFailure,
  loadComparedReasonAnalysisSuccess,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadLeaversByReason,
  loadLeaversByReasonFailure,
  loadLeaversByReasonSuccess,
  loadReasonAnalysis,
  loadReasonAnalysisFailure,
  loadReasonAnalysisSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
  selectComparedReason,
  selectReason,
  selectReasonsForLeavingTab,
  toggleComparedReasonAnalysis,
  toggleReasonAnalysis,
} from './actions/reasons-and-counter-measures.actions';
import {
  showByReasonId,
  showReasonAnalysis,
  updateReasonAnalysisDataOnSuccess,
} from './utils';

export const reasonsAndCounterMeasuresFeatureKey = 'reasonsAndCounterMeasures';

export const getInitialSelectedTimeRange = (today: Moment) => {
  // use month before to prevent wrong calculations for the future
  const nowDate = today
    .clone()
    .utc()
    .subtract(DATA_IMPORT_DAY, 'days') // use previous month if data is not imported yet
    .subtract(1, 'month')
    .endOf('month');
  const oldDate = getMonth12MonthsAgo(nowDate);

  return getTimeRangeFromDates(oldDate, nowDate);
};

export interface ReasonsAndCounterMeasuresState {
  reasonsForLeaving: {
    selectedTab: ReasonForLeavingTab;
    reasons: {
      reasonsData: {
        loading: boolean;
        data?: ReasonForLeavingStats;
        errorMessage?: string;
      };
      reasonAnalysis: {
        data: TextAnalysisResponse;
        loading: boolean;
        errorMessage?: string;
      };
      selectedReason?: string;
    };
    comparedReasons: {
      reasonsData: {
        loading: boolean;
        data?: ReasonForLeavingStats;
        errorMessage?: string;
      };
      reasonAnalysis: {
        data: TextAnalysisResponse;
        loading: boolean;
        errorMessage?: string;
      };
      selectedReason?: string;
    };
    leavers: {
      loading: boolean;
      data?: ExitEntryEmployeesResponse;
      errorMessage?: string;
    };
  };
}

export const initialState: ReasonsAndCounterMeasuresState = {
  reasonsForLeaving: {
    selectedTab: ReasonForLeavingTab.OVERALL_REASONS,
    reasons: {
      reasonsData: {
        data: undefined,
        loading: false,
        errorMessage: undefined,
      },
      reasonAnalysis: {
        data: undefined,
        loading: false,
        errorMessage: undefined,
      },
      selectedReason: undefined,
    },
    comparedReasons: {
      reasonsData: {
        data: undefined,
        loading: false,
        errorMessage: undefined,
      },
      reasonAnalysis: {
        data: undefined,
        loading: false,
        errorMessage: undefined,
      },
      selectedReason: undefined,
    },
    leavers: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
  },
};

export const reasonsAndCounterMeasuresReducer = createReducer(
  initialState,
  on(
    selectReasonsForLeavingTab,
    (
      state: ReasonsAndCounterMeasuresState,
      { selectedTab }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        selectedTab,
      },
    })
  ),
  on(
    loadReasonsWhyPeopleLeft,
    (
      state: ReasonsAndCounterMeasuresState
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          reasonsData: {
            ...state.reasonsForLeaving.reasons.reasonsData,
            loading: true,
          },
          reasonAnalysis: {
            data: undefined,
            loading: false,
            errorMessage: undefined,
          },
          selectedReason: undefined,
        },
      },
    })
  ),
  on(
    loadReasonsWhyPeopleLeftSuccess,
    (
      state: ReasonsAndCounterMeasuresState,
      { data }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          reasonsData: {
            ...state.reasonsForLeaving.reasons.reasonsData,
            data,
            loading: false,
          },
        },
      },
    })
  ),
  on(
    loadReasonsWhyPeopleLeftFailure,
    (
      state: ReasonsAndCounterMeasuresState,
      { errorMessage }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          reasonsData: {
            ...state.reasonsForLeaving.reasons.reasonsData,
            data: undefined,
            errorMessage,
            loading: false,
          },
          selectedReason: undefined,
          reasonAnalysis: {
            data: undefined,
            loading: false,
            errorMessage: undefined,
          },
        },
      },
    })
  ),
  on(
    loadComparedReasonsWhyPeopleLeft,
    (
      state: ReasonsAndCounterMeasuresState
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          reasonsData: {
            ...state.reasonsForLeaving.comparedReasons.reasonsData,
            loading: true,
          },
          selectedReason: undefined,
          reasonAnalysis: {
            data: undefined,
            loading: false,
            errorMessage: undefined,
          },
        },
      },
    })
  ),
  on(
    loadComparedReasonsWhyPeopleLeftSuccess,
    (
      state: ReasonsAndCounterMeasuresState,
      { data }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          reasonsData: {
            ...state.reasonsForLeaving.comparedReasons.reasonsData,
            data,
            loading: false,
          },
        },
      },
    })
  ),
  on(
    loadComparedReasonsWhyPeopleLeftFailure,
    (
      state: ReasonsAndCounterMeasuresState,
      { errorMessage }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          reasonsData: {
            ...state.reasonsForLeaving.comparedReasons.reasonsData,
            data: undefined,
            errorMessage,
            loading: false,
          },
        },
      },
    })
  ),
  on(
    loadLeaversByReason,
    (
      state: ReasonsAndCounterMeasuresState
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        leavers: {
          ...state.reasonsForLeaving.leavers,
          data: undefined,
          loading: true,
        },
      },
    })
  ),
  on(
    loadComparedLeaversByReason,
    (
      state: ReasonsAndCounterMeasuresState
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        leavers: {
          ...state.reasonsForLeaving.leavers,
          data: undefined,
          loading: true,
        },
      },
    })
  ),
  on(
    loadLeaversByReasonSuccess,
    (
      state: ReasonsAndCounterMeasuresState,
      { data }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        leavers: {
          ...state.reasonsForLeaving.leavers,
          data,
          loading: false,
          errorMessage: undefined,
        },
      },
    })
  ),
  on(
    loadLeaversByReasonFailure,
    (
      state: ReasonsAndCounterMeasuresState,
      { errorMessage }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        leavers: {
          ...state.reasonsForLeaving.leavers,
          data: undefined,
          errorMessage,
          loading: false,
        },
      },
    })
  ),
  on(
    selectReason,
    (
      state: ReasonsAndCounterMeasuresState,
      { reason }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          selectedReason: reason,
        },
      },
    })
  ),
  on(
    selectComparedReason,
    (
      state: ReasonsAndCounterMeasuresState,
      { reason }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          selectedReason: reason,
        },
      },
    })
  ),
  on(
    loadReasonAnalysis,
    (
      state: ReasonsAndCounterMeasuresState,
      { reasonIds }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          reasonAnalysis: {
            ...state.reasonsForLeaving.reasons.reasonAnalysis,
            data: {
              ...state.reasonsForLeaving.reasons.reasonAnalysis.data,
              answer: {
                ...state.reasonsForLeaving.reasons.reasonAnalysis.data?.answer,
                reasons: state.reasonsForLeaving.reasons.reasonAnalysis
                  ? showReasonAnalysis(
                      reasonIds,
                      state.reasonsForLeaving.reasons.reasonAnalysis.data
                        ?.answer.reasons
                    )
                  : [],
              },
            },
            loading: true,
          },
        },
      },
    })
  ),
  on(
    loadReasonAnalysisSuccess,
    (
      state: ReasonsAndCounterMeasuresState,
      { data }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          reasonAnalysis: {
            ...state.reasonsForLeaving.reasons.reasonAnalysis,
            data: {
              ...data,
              answer: {
                generalQuestions: data?.answer.generalQuestions,
                reasons: updateReasonAnalysisDataOnSuccess(
                  data?.answer.reasons,
                  state.reasonsForLeaving.reasons.reasonAnalysis.data?.answer
                    .reasons
                ),
              },
            },
            loading: false,
            errorMessage: undefined as string,
          },
        },
      },
    })
  ),
  on(
    loadReasonAnalysisFailure,
    (
      state: ReasonsAndCounterMeasuresState,
      { errorMessage }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          reasonAnalysis: {
            ...state.reasonsForLeaving.reasons.reasonAnalysis,
            data: undefined,
            errorMessage,
            loading: false,
          },
        },
      },
    })
  ),
  on(
    toggleReasonAnalysis,
    (
      state: ReasonsAndCounterMeasuresState,
      { reasonId }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          reasonAnalysis: {
            ...state.reasonsForLeaving.reasons.reasonAnalysis,
            data: {
              ...state.reasonsForLeaving.reasons.reasonAnalysis.data,
              answer: {
                ...state.reasonsForLeaving.reasons.reasonAnalysis.data?.answer,
                reasons: state.reasonsForLeaving.reasons.reasonAnalysis.data
                  ? state.reasonsForLeaving.reasons.reasonAnalysis.data?.answer.reasons.map(
                      (analysis) => showByReasonId(analysis, reasonId)
                    )
                  : [],
              },
            },
          },
        },
      },
    })
  ),
  on(
    loadComparedReasonAnalysis,
    (
      state: ReasonsAndCounterMeasuresState,
      { reasonIds }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          reasonAnalysis: {
            ...state.reasonsForLeaving.comparedReasons.reasonAnalysis,
            data: {
              ...state.reasonsForLeaving.comparedReasons.reasonAnalysis.data,
              answer: {
                ...state.reasonsForLeaving.comparedReasons.reasonAnalysis.data
                  ?.answer,
                reasons: state.reasonsForLeaving.comparedReasons.reasonAnalysis
                  ? showReasonAnalysis(
                      reasonIds,
                      state.reasonsForLeaving.comparedReasons.reasonAnalysis
                        .data?.answer.reasons
                    )
                  : [],
              },
            },
            loading: true,
          },
        },
      },
    })
  ),
  on(
    loadComparedReasonAnalysisSuccess,
    (state: ReasonsAndCounterMeasuresState, { data }) => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          reasonAnalysis: {
            ...state.reasonsForLeaving.comparedReasons.reasonAnalysis,
            data: {
              ...data,
              answer: {
                generalQuestions: data?.answer.generalQuestions,
                reasons: updateReasonAnalysisDataOnSuccess(
                  data?.answer.reasons,
                  state.reasonsForLeaving.comparedReasons.reasonAnalysis.data
                    ?.answer.reasons
                ),
              },
            },
            loading: false,
            errorMessage: undefined as string,
          },
        },
      },
    })
  ),
  on(
    loadComparedReasonAnalysisFailure,
    (
      state: ReasonsAndCounterMeasuresState,
      { errorMessage }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          reasonAnalysis: {
            ...state.reasonsForLeaving.comparedReasons.reasonAnalysis,
            data: undefined,
            errorMessage,
            loading: false,
          },
        },
      },
    })
  ),
  on(
    toggleComparedReasonAnalysis,
    (
      state: ReasonsAndCounterMeasuresState,
      { reasonId }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          reasonAnalysis: {
            ...state.reasonsForLeaving.comparedReasons.reasonAnalysis,
            data: {
              ...state.reasonsForLeaving.comparedReasons.reasonAnalysis.data,
              answer: {
                ...state.reasonsForLeaving.comparedReasons.reasonAnalysis.data
                  ?.answer,
                reasons: state.reasonsForLeaving.comparedReasons.reasonAnalysis
                  ? state.reasonsForLeaving.comparedReasons.reasonAnalysis.data?.answer.reasons.map(
                      (analysis) => showByReasonId(analysis, reasonId)
                    )
                  : [],
              },
            },
          },
        },
      },
    })
  )
);

const { selectAll } = filterAdapter.getSelectors();

export const selectAllComparedSelectedFilters = selectAll;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: ReasonsAndCounterMeasuresState,
  action: Action
): ReasonsAndCounterMeasuresState {
  return reasonsAndCounterMeasuresReducer(state, action);
}

export const selectReasonsAndCounterMeasuresState =
  createFeatureSelector<ReasonsAndCounterMeasuresState>(
    reasonsAndCounterMeasuresFeatureKey
  );
