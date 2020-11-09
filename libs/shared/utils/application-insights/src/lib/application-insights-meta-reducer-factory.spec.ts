import { Injector } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { META_REDUCERS, Store, StoreModule } from '@ngrx/store';

import {
  applicationInsightsMetaReducerFactory,
  shouldLogEvent,
} from './application-insights-meta-reducer-factory';
import { APPLICATION_INSIGHTS_CONFIG } from './application-insights-module-config';
import { ApplicationInsightsService } from './application-insights.service';
import { NGRX_IGNORE_PATTERN } from './ngrx-ignore-pattern';

describe('ApplicationInsightsMetaReducerFactory', () => {
  let service: ApplicationInsightsService;
  let spectator: SpectatorService<ApplicationInsightsService>;
  let store: Store;

  const serviceFactory = createServiceFactory({
    service: ApplicationInsightsService,
    imports: [
      StoreModule.forRoot({}, { metaReducers: [] }),
      RouterTestingModule,
    ],
    providers: [
      ApplicationInsightsService,
      {
        provide: APPLICATION_INSIGHTS_CONFIG,
        useValue: {
          applicationInsightsConfig: {
            instrumentationKey: 'key',
          },
        },
      },
      {
        provide: META_REDUCERS,
        deps: [ApplicationInsightsService, Injector],
        useFactory: applicationInsightsMetaReducerFactory,
        multi: true,
      },
      {
        provide: NGRX_IGNORE_PATTERN,
        useValue: ['@ngrx/*'],
      },
    ],
  });

  beforeEach(() => {
    spectator = serviceFactory();
    service = spectator.service;

    store = spectator.inject(Store);
  });

  describe('meta reducer', () => {
    it('should call logEvent for dispatched action', () => {
      service.logEvent = jest.fn();
      const action = { type: '[Search] Update Filter' };

      store.dispatch(action);

      expect(service.logEvent).toHaveBeenCalled();
    });
  });

  describe('shouldLogEvent', () => {
    const ignorePatternRegExpressions: RegExp[] = [new RegExp('@ngrx/*')];
    let actionType: string;
    let result: boolean;

    beforeEach(() => {
      actionType = '';
      result = false;
    });

    it('should return true', () => {
      actionType = '[Search] Update Filter';

      result = shouldLogEvent(actionType, ignorePatternRegExpressions);

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      actionType = '@ngrx/store-devtools/do-this-and-that';

      // prove that function is working
      result = true;
      result = shouldLogEvent(actionType, ignorePatternRegExpressions);

      expect(result).toBeFalsy();
    });
  });
});
