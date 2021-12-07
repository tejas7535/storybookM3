import { Injector } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { OneTrustService } from '@altack/ngx-onetrust';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { META_REDUCERS, Store, StoreModule } from '@ngrx/store';

import { ApplicationInsightsService } from './application-insights.service';
import {
  applicationInsightsMetaReducerFactory,
  shouldLogEvent,
} from './application-insights-meta-reducer-factory';
import { APPLICATION_INSIGHTS_CONFIG } from './application-insights-module-config';
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
        provide: OneTrustService,
        useValue: {
          consentChanged$: () => of(new Map()),
        },
      },
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
    const ignorePatternRegExpressions: RegExp[] = [
      new RegExp('@ngrx/*'),
      // eslint-disable-next-line no-control-regex
      new RegExp('Auth\b*'),
    ];
    let actionType: string;

    beforeEach(() => {
      actionType = '';
    });

    it('should return true', () => {
      actionType = '[Search] Update Filter';

      const result = shouldLogEvent(actionType, ignorePatternRegExpressions);

      expect(result).toBeTruthy();
    });

    it('should return false for @ngrx internal actions', () => {
      actionType = '@ngrx/store-devtools/do-this-and-that';

      const result = shouldLogEvent(actionType, ignorePatternRegExpressions);

      expect(result).toBeFalsy();
    });

    it('should return false for [Auth] action types', () => {
      actionType = '[Auth] Login Successful';

      const result = shouldLogEvent(actionType, ignorePatternRegExpressions);

      expect(result).toBeFalsy();
    });
  });
});
