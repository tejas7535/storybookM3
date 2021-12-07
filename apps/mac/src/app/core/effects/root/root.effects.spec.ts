import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles';

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
      marbles((m) => {
        const accountInfo: AccountInfo = {
          username: 'Bob',
          department: 'C-IT',
        } as AccountInfo;

        action = loginSuccess({ accountInfo });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-a', { a: 'C-IT' });

        m.expect(effects.initializeApplicationInsights$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          applicationInsightsService.addCustomPropertyToTelemetryData
        ).toHaveBeenCalledWith('department', 'C-IT');
      })
    );

    test(
      'should call addTelemetryData of AI Service with department unavailable',
      marbles((m) => {
        const accountInfo: AccountInfo = {
          username: 'Bob',
          department: undefined,
        } as AccountInfo;

        action = loginSuccess({ accountInfo });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-a', { a: 'Department unavailable' });

        m.expect(effects.initializeApplicationInsights$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          applicationInsightsService.addCustomPropertyToTelemetryData
        ).toHaveBeenCalledWith('department', 'Department unavailable');
      })
    );
  });
});
