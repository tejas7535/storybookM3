import { createSelector } from '@ngrx/store';

import { getThingState } from '../../reducers';
import { MessageEvent } from '../../reducers/thing/models';
import { ThingState } from '../../reducers/thing/thing.reducer';

export const getThingLoading = createSelector(
  getThingState,
  (state: ThingState) => state.thing.loading
);

export const getThingThing = createSelector(
  getThingState,
  (state: ThingState) => state.thing.thing
);

export const getThingSensorId = createSelector(
  getThingState,
  () => 'ee7bffbe-2e87-49f0-b763-ba235dd7c876'
); // will later access a valid id within the inital wot thing result

export const getSocketStatus = createSelector(
  getThingState,
  (state: ThingState) => state.thing.socketStatus
);

export const getEdm = createSelector(
  getThingState,
  (state: ThingState) => state.thing.measurements
);

export const getMessages = createSelector(
  getThingState,
  (state: ThingState) => state.thing.messages
);

export const getMessagesEvents = createSelector(
  getMessages,
  (messages: any) => messages.events
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
  getMessages,
  getCurrentMessageId,
  (messages: any, currentMessage: MessageEvent) =>
    currentMessage === undefined
      ? undefined
      : {
          timestamp: currentMessage.timestamp,
          body: messages.contents[currentMessage.id],
        }
);
