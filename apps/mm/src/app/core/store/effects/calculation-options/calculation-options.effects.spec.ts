import { Observable, of } from 'rxjs';

import { RestService } from '@mm/core/services';
import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { PreflightDataParserService } from '@mm/core/services/preflght-data-parser/preflight-data-parser.service';
import { MMBearingPreflightResponse } from '@mm/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CalculationOptionsActions } from '../../actions';
import { CalculationSelectionFacade } from '../../facades/calculation-selection/calculation-selection.facade';
import { Bearing } from '../../models/calculation-selection-state.model';
import { CalculationOptionsEffects } from './calculation-options.effects';

describe('CalculationOptionsEffects', () => {
  let spectator: SpectatorService<CalculationOptionsEffects>;
  let actions$: Observable<any>;
  let effects: CalculationOptionsEffects;
  let restService: jest.Mocked<RestService>;
  let facade: jest.Mocked<CalculationSelectionFacade>;

  let preflightDataParserService: jest.Mocked<PreflightDataParserService>;

  const createEffect = createServiceFactory({
    service: CalculationOptionsEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: RestService,
        useValue: {
          getBearingPreflightResponse: jest.fn(),
        },
      },
      {
        provide: CalculationSelectionFacade,
        useValue: {
          getBearing$: jest.fn(),
          getBearingSeatId$: jest.fn(),
          getCurrentStep$: jest.fn(),
        },
      },
      {
        provide: PreflightDataParserService,
        useValue: {
          formatPreflightData: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createEffect();
    restService = spectator.inject(RestService) as jest.Mocked<RestService>;
    facade = spectator.inject(
      CalculationSelectionFacade
    ) as jest.Mocked<CalculationSelectionFacade>;
    preflightDataParserService = spectator.inject(
      PreflightDataParserService
    ) as jest.Mocked<PreflightDataParserService>;
    effects = spectator.service;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should dispatch setCalculationOptions action when fetchPreflightOptions$ is successful', () => {
    const preflightOptions = {
      options: 'testOptions',
    } as Partial<MMBearingPreflightResponse> as MMBearingPreflightResponse;

    const formattedOptions = {
      innerRingExpansion: '123',
      radialClearanceReduction: '567',
    } as Partial<PreflightData> as PreflightData;

    const bearing = {
      type: { typeId: 'type123' },
      bearingId: 'bearing123',
      series: { seriesId: 'series123' },
    } as Partial<Bearing> as Bearing;

    facade.getBearing$.mockReturnValue(of(bearing));
    facade.getBearingSeatId$.mockReturnValue(of('seat123'));
    facade.getCurrentStep$.mockReturnValue(of(3));

    restService.getBearingPreflightResponse.mockReturnValue(
      of(preflightOptions)
    );
    preflightDataParserService.formatPreflightData.mockReturnValue(
      formattedOptions
    );

    return marbles((m) => {
      actions$ = m.hot('-a-', {
        a: CalculationOptionsActions.fetchPreflightOptions(),
      });

      const expected = m.cold('-b-', {
        b: CalculationOptionsActions.setCalculationOptions({
          options: formattedOptions,
        }),
      });

      m.expect(effects.fetchPreflightOptions$).toBeObservable(expected);
      m.flush();
    })();
  });
});
