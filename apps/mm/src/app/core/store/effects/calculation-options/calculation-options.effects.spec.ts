import { Observable, of } from 'rxjs';

import { RestService } from '@mm/core/services';
import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { PreflightDataParserService } from '@mm/core/services/preflght-data-parser/preflight-data-parser.service';
import { LB_AXIAL_DISPLACEMENT } from '@mm/shared/constants/dialog-constant';
import { MMBearingPreflightResponse } from '@mm/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CalculationOptionsActions } from '../../actions';
import { CalculationResultActions } from '../../actions/calculation-result';
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
          getMeasurementMethod$: jest.fn(),
          getMountingMethod$: jest.fn(),
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
      bearingId: 'bearing123',
    } as Bearing;

    facade.getBearing$.mockReturnValue(of(bearing));
    facade.getBearingSeatId$.mockReturnValue(of('seat123'));
    facade.getCurrentStep$.mockReturnValue(of(3));
    facade.getMeasurementMethod$.mockReturnValue(of(LB_AXIAL_DISPLACEMENT));
    facade.getMountingMethod$.mockReturnValue(of('mouting-method'));

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

  it('should dispatch only setCalculationOptions when measurement method is LB_AXIAL_DISPLACEMENT', () => {
    const preflightOptions = {
      options: 'testOptions',
    } as Partial<MMBearingPreflightResponse> as MMBearingPreflightResponse;

    const formattedOptions = {
      innerRingExpansion: '123',
      radialClearanceReduction: '567',
    } as PreflightData;

    const bearing = {
      bearingId: 'bearing123',
    } as Bearing;

    facade.getBearing$.mockReturnValue(of(bearing));
    facade.getBearingSeatId$.mockReturnValue(of('seat123'));
    facade.getCurrentStep$.mockReturnValue(of(3));
    facade.getMeasurementMethod$.mockReturnValue(of(LB_AXIAL_DISPLACEMENT));
    facade.getMountingMethod$.mockReturnValue(of('mounting-method'));

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

      expect(restService.getBearingPreflightResponse).toHaveBeenCalledWith({
        IDCO_DESIGNATION: 'bearing123',
        IDMM_BEARING_SEAT: 'seat123',
        IDMM_MEASSURING_METHOD: LB_AXIAL_DISPLACEMENT,
        IDMM_MOUNTING_METHOD: 'mounting-method',
      });
    })();
  });

  it('should dispatch both setCalculationOptions and calculateResult when measurement method is not LB_AXIAL_DISPLACEMENT', () => {
    const preflightOptions = {
      options: 'testOptions',
    } as Partial<MMBearingPreflightResponse> as MMBearingPreflightResponse;

    const formattedOptions = {
      innerRingExpansion: '123',
      radialClearanceReduction: '567',
    } as PreflightData;

    const bearing = {
      bearingId: 'bearing123',
    } as Bearing;

    const nonAxialMethod = 'SOME_OTHER_METHOD';

    facade.getBearing$.mockReturnValue(of(bearing));
    facade.getBearingSeatId$.mockReturnValue(of('seat123'));
    facade.getCurrentStep$.mockReturnValue(of(3));
    facade.getMeasurementMethod$.mockReturnValue(of(nonAxialMethod));
    facade.getMountingMethod$.mockReturnValue(of('mounting-method'));

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

      const expected = m.cold('-(bc)-', {
        b: CalculationOptionsActions.setCalculationOptions({
          options: formattedOptions,
        }),
        c: CalculationResultActions.calculateResult(),
      });

      const result$ = effects.fetchPreflightOptions$;
      m.expect(result$).toBeObservable(expected);

      m.flush();

      expect(restService.getBearingPreflightResponse).toHaveBeenCalledWith({
        IDCO_DESIGNATION: 'bearing123',
        IDMM_BEARING_SEAT: 'seat123',
        IDMM_MEASSURING_METHOD: nonAxialMethod,
        IDMM_MOUNTING_METHOD: 'mounting-method',
      });
    })();
  });
});
