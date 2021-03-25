import { waitForAsync } from '@angular/core/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot } from 'jasmine-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { loginSuccess } from '@schaeffler/auth';

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
      RootEffects,
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
    const user = {
      name: 'Bob',
      department: 'C-IT',
    };

    action = loginSuccess({ user });
    test(
      'should call addTelemetryData of AI Service',
      waitForAsync(() => {
        actions$ = hot('-a', { a: action });

        // tslint:disable-next-line: deprecation
        effects.initializeApplicationInsights$.subscribe(() => {
          expect(
            applicationInsightsService.addCustomPropertyToTelemetryData
          ).toHaveBeenCalledWith('department', 'C-IT');
        });
      })
    );
  });
});
