import { Injector } from '@angular/core';

import { ActionReducer, MetaReducer } from '@ngrx/store';

import { ApplicationInsightsService } from './application-insights.service';
import { NGRX_IGNORE_PATTERN } from './ngrx-ignore-pattern';

// tslint:disable-next-line: only-arrow-functions
export function applicationInsightsMetaReducerFactory(
  applicationInsightsService: ApplicationInsightsService,
  injector: Injector
): MetaReducer {
  return (reducer: ActionReducer<any, any>): ActionReducer<any, any> => {
    const ignorePattern: string[] = injector.get<string[]>(NGRX_IGNORE_PATTERN);
    const ignorePatternRegExpressions = ignorePattern.map(
      (pattern) => new RegExp(pattern)
    );

    return (state, action) => {
      if (shouldLogEvent(action.type, ignorePatternRegExpressions)) {
        applicationInsightsService.logEvent(action.type);
      }

      return reducer(state, action);
    };
  };
}

export const shouldLogEvent = (
  actionType: string,
  ignorePatternRegExpressions: RegExp[]
): boolean => {
  for (const regExp of ignorePatternRegExpressions) {
    if (regExp.test(actionType)) {
      return false;
    }
  }

  return true;
};
