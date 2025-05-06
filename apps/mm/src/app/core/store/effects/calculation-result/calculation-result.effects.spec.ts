import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';

import { RestService } from '@mm/core/services';
import { BearinxOnlineResult } from '@mm/core/services/bearinx-result.interface';
import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { ReportParserService } from '@mm/core/services/report-parser/report-parser.service';
import { PROPERTIES } from '@mm/shared/constants/tracking-names';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { CalculationResultActions } from '../../actions/calculation-result';
import { CalculationOptionsFacade } from '../../facades/calculation-options/calculation-options.facade';
import { CalculationSelectionFacade } from '../../facades/calculation-selection/calculation-selection.facade';
import { CalculationResult } from '../../models/calculation-result-state.model';
import { Bearing } from '../../models/calculation-selection-state.model';
import { CalculationResultEffects } from './calculation-result.effects';

describe('CalculationResultEffects', () => {
  let actions$: Observable<Action>;
  let effects: CalculationResultEffects;
  let spectator: SpectatorService<CalculationResultEffects>;
  let restService: RestService;
  let reportParserServiceMock: jest.Mocked<ReportParserService>;
  let calculationSelectionFacadeMock: jest.Mocked<CalculationSelectionFacade>;
  let calculationOptionsFacadeMock: jest.Mocked<CalculationOptionsFacade>;
  let applicationInsightsService: ApplicationInsightsService;

  const mockPayload = {
    IDCO_DESIGNATION: 'bearing-id',
    IDMM_BEARING_SEAT: 'seat-id',
    IDMM_CLEARANCE_REDUCTION_INPUT: 'mounting-option',
    IDMM_HYDRAULIC_NUT_TYPE: 'hydraulic-nut-type',
    IDMM_INNER_RING_EXPANSION: 0.1,
    IDMM_INNER_SHAFT_DIAMETER: 50,
    IDMM_MEASSURING_METHOD: 'measurement-method',
    IDMM_MODULUS_OF_ELASTICITY: 200,
    IDMM_MOUNTING_METHOD: 'mounting-method',
    IDMM_NUMBER_OF_PREVIOUS_MOUNTINGS: 2,
    IDMM_POISSON_RATIO: 0.3,
    IDMM_RADIAL_CLEARANCE_REDUCTION: 0.05,
    IDMM_SHAFT_MATERIAL: 'steel',
  };

  const mockResponse = {
    title: 'parsed-result',
  } as Partial<BearinxOnlineResult> as BearinxOnlineResult;

  const createService = createServiceFactory({
    service: CalculationResultEffects,
    providers: [
      provideMockStore(),
      provideMockActions(() => actions$),
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        provide: ReportParserService,
        useValue: {
          parseResponse: jest.fn(),
        },
      },
      {
        provide: RestService,
        useValue: {
          getBearinxVersions: jest.fn(),
          getBearingCalculationResult: jest.fn(),
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
        provide: CalculationOptionsFacade,
        useValue: {
          getOptions$: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    effects = spectator.service;
    restService = spectator.inject(RestService);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
    reportParserServiceMock = spectator.inject(
      ReportParserService
    ) as jest.Mocked<ReportParserService>;
    calculationSelectionFacadeMock = spectator.inject(
      CalculationSelectionFacade
    ) as jest.Mocked<CalculationSelectionFacade>;

    calculationOptionsFacadeMock = spectator.inject(CalculationOptionsFacade);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('when calculating result', () => {
    beforeEach(() => {
      jest
        .spyOn(calculationSelectionFacadeMock, 'getBearing$')
        .mockReturnValue(
          of({ bearingId: 'bearing-id' } as Partial<Bearing> as Bearing)
        );
      jest
        .spyOn(calculationSelectionFacadeMock, 'getBearingSeatId$')
        .mockReturnValue(of('seat-id'));
      jest
        .spyOn(calculationSelectionFacadeMock, 'getMeasurementMethod$')
        .mockReturnValue(of('measurement-method'));
      jest
        .spyOn(calculationSelectionFacadeMock, 'getMountingMethod$')
        .mockReturnValue(of('mounting-method'));

      const options: PreflightData = {
        mountingOption: 'mounting-option',
        hudraulicNutType: { value: 'hydraulic-nut-type', options: [] },
        innerRingExpansion: 0.1,
        shaftDiameter: 50,
        modulusOfElasticity: 200,
        numberOfPreviousMountings: 2,
        poissonRatio: 0.3,
        radialClearanceReduction: 0.05,
        shaftMaterial: 'steel',
      } as unknown as PreflightData;

      jest
        .spyOn(calculationOptionsFacadeMock, 'getOptions$')
        .mockReturnValue(of(options));
    });

    it('should dispatch setCalculationResult and setCurrentStep on success', () => {
      const parsedResult = {
        inputs: [],
      } as CalculationResult;

      jest
        .spyOn(restService, 'getBearingCalculationResult')
        .mockReturnValue(of(mockResponse));
      jest
        .spyOn(reportParserServiceMock, 'parseResponse')
        .mockReturnValue(parsedResult);

      return marbles((m) => {
        const action = CalculationResultActions.calculateResult();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(b)', {
          b: CalculationResultActions.setCalculationResult({
            result: parsedResult,
          }),
        });

        m.expect(effects.calculateResult$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingCalculationResult).toHaveBeenCalledWith(
          mockPayload
        );
        expect(reportParserServiceMock.parseResponse).toHaveBeenCalledWith(
          mockResponse
        );

        expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
          PROPERTIES,
          mockPayload
        );
      })();
    });

    it('should dispatch calculateResultFailure on error', () => {
      jest
        .spyOn(restService, 'getBearingCalculationResult')
        .mockReturnValue(
          throwError(
            () => new HttpErrorResponse({ error: { detail: 'Error detail' } })
          )
        );

      return marbles((m) => {
        const action = CalculationResultActions.calculateResult();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: CalculationResultActions.calculateResultFailure({
            error: 'Error detail',
          }),
        });

        m.expect(effects.calculateResult$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingCalculationResult).toHaveBeenCalledWith(
          mockPayload
        );

        expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
          PROPERTIES,
          mockPayload
        );
      })();
    });
  });

  describe('fetchBearinxVersions', () => {
    it('should fetch the bearinx versions', () => {
      const fetchSpy = jest
        .spyOn(restService, 'getBearinxVersions')
        .mockImplementation(() => of({ abc: '123' }));

      return marbles((m) => {
        const action = CalculationResultActions.fetchBearinxVersions();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: CalculationResultActions.setBearinxVersions({
            versions: { abc: '123' },
          }),
        });

        m.expect(effects.fetchBearinxVersion$).toBeObservable(expected);
        m.flush();

        expect(fetchSpy).toHaveBeenCalled();
      })();
    });

    it('should unset bearinx versions on error', () => {
      const fetchSpy = jest
        .spyOn(restService, 'getBearinxVersions')
        .mockImplementation(() => throwError(() => 'error'));

      return marbles((m) => {
        const action = CalculationResultActions.fetchBearinxVersions();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: CalculationResultActions.unsetBearinxVersions(),
        });

        m.expect(effects.fetchBearinxVersion$).toBeObservable(expected);
        m.flush();

        expect(fetchSpy).toHaveBeenCalled();
      })();
    });
  });
});
