import { createSelector } from '@ngrx/store';

import { getConditionMonitoringState } from '../../reducers';
import { ConditionMonitoringState } from '../../reducers/condition-monitoring/condition-monitoring.reducer';
import { MessageEvent } from '../../reducers/condition-monitoring/models';

export const getSocketStatus = createSelector(
  getConditionMonitoringState,
  (state: ConditionMonitoringState): number => state.centerLoad.socketStatus
);

export const getCenterLoad = createSelector(
  getConditionMonitoringState,
  (state: ConditionMonitoringState) => state.centerLoad
);

export const getMessagesEvents = createSelector(
  getCenterLoad,
  (centerLoad: any) => centerLoad.events
);

export const getCurrentMessageId = createSelector(
  getMessagesEvents,
  (events: any) => {
    if (events.length === 0) {
      return undefined;
    }

    let currentMessage: MessageEvent = {
      id: undefined,
      timestamp: 0,
    };
    events.forEach((element: MessageEvent) => {
      if (element.timestamp > currentMessage.timestamp) {
        currentMessage = element;
      }
    });

    return currentMessage;
  }
);

export const getCurrentMessage = createSelector(
  getCenterLoad,
  getCurrentMessageId,
  (centerLoad: any, currentMessage: MessageEvent) =>
    currentMessage === undefined
      ? undefined
      : {
          timestamp: currentMessage.timestamp,
          body: centerLoad.contents[currentMessage.id],
        }
);
