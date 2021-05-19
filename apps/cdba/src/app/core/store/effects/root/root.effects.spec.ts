import { waitForAsync } from '@angular/core/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot } from 'jasmine-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { AccountInfo, loginSuccess } from '@schaeffler/azure-auth';

import { RootEffects } from './root.effects';

describe('Root Effects', () => {
  let action: any;
  let actions$: any;
  let effects: RootEffects;
  let spectator: SpectatorService<RootEffects>;
  let applicationInsightsService: ApplicationInsightsService;

  const createService = createServiceFactory({
    service: RootEffects,
    providers: [
      provideMockActions(() => actions$),
      {
        provide: ApplicationInsightsService,
        useValue: {
          addCustomPropertyToTelemetryData: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(RootEffects);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
  });

  describe('initializeApplicationInsights$', () => {
    test(
      'should call addTelemetryData of AI Service',
      waitForAsync(() => {
        const accountInfo: AccountInfo = {
          username: 'bob@schaeffler.com',
          name: 'Bob',
          department: 'C-IT',
        } as AccountInfo;

        action = loginSuccess({ accountInfo });

        actions$ = hot('-a', { a: action });

        // eslint-disable-next-line import/no-deprecated
        effects.initializeApplicationInsights$.subscribe(() => {
          expect(
            applicationInsightsService.addCustomPropertyToTelemetryData
          ).toHaveBeenCalledWith('department', 'C-IT');
        });
      })
    );

    test(
      'should call addTelemetryData of AI Service with department unavailable',
      waitForAsync(() => {
        const accountInfo: AccountInfo = {
          username: 'bob@schaeffler.com',
          name: 'Bob',
          department: undefined,
        } as AccountInfo;

        action = loginSuccess({ accountInfo });

        actions$ = hot('-a', { a: action });

        // eslint-disable-next-line import/no-deprecated
        effects.initializeApplicationInsights$.subscribe(() => {
          expect(
            applicationInsightsService.addCustomPropertyToTelemetryData
          ).toHaveBeenCalledWith('department', 'Department unavailable');
        });
      })
    );
  });
});
