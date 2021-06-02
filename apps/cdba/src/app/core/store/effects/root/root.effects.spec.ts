import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';

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
      'should add the department of the user as Telemetry data',
      marbles((m) => {
        const accountInfo: AccountInfo = {
          username: 'Bob',
          department: 'C-IT',
          idTokenClaims: {},
        } as AccountInfo;

        action = loginSuccess({ accountInfo });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-a', { a: accountInfo });

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
      'should add department unavailable as Telemetry data if we cannot determine the department',
      marbles((m) => {
        const accountInfo: AccountInfo = {
          username: 'Bob',
          department: undefined,
          idTokenClaims: {},
        } as AccountInfo;

        action = loginSuccess({ accountInfo });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-a', { a: accountInfo });

        m.expect(effects.initializeApplicationInsights$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          applicationInsightsService.addCustomPropertyToTelemetryData
        ).toHaveBeenCalledWith('department', 'Department unavailable');
      })
    );

    test(
      'should include functional role as Telemetry data',
      marbles((m) => {
        const accountInfo: AccountInfo = {
          username: 'Bob',
          department: 'C-IT',
          idTokenClaims: {
            roles: [
              'CDBA_BASIC',
              'CDBA_PL_42',
              'CDBA_FUNC_APPLICATION_ENGINEERING',
              'CDBA_REGION_GREATER_CHINA',
            ],
          },
        } as AccountInfo;

        action = loginSuccess({ accountInfo });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-a', { a: accountInfo });

        m.expect(effects.initializeApplicationInsights$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          applicationInsightsService.addCustomPropertyToTelemetryData
        ).toHaveBeenCalledWith(
          'functional_role',
          'CDBA_FUNC_APPLICATION_ENGINEERING'
        );
      })
    );

    test(
      'should call addTelemetryData of AI Service with department unavailable',
      marbles((m) => {
        const accountInfo: AccountInfo = {
          username: 'Bob',
          department: undefined,
          idTokenClaims: {
            roles: ['CDBA_BASIC', 'CDBA_PL_42', 'CDBA_REGION_GREATER_CHINA'],
          },
        } as AccountInfo;

        action = loginSuccess({ accountInfo });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-a', { a: accountInfo });

        m.expect(effects.initializeApplicationInsights$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          applicationInsightsService.addCustomPropertyToTelemetryData
        ).toHaveBeenCalledWith(
          'functional_role',
          'Functional role unavailable'
        );
      })
    );
  });
});
