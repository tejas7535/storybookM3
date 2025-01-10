/* eslint-disable jest/expect-expect */

import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { DownstreamCalculationService } from '@ea/core/services/downstream-calculation.service';
import { DownstreamCalculationInputsService } from '@ea/core/services/downstream-calculation-inputs.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Context, marbles } from 'rxjs-marbles';

import { CO2DownstreamCalculationActions } from '../../actions';
import {
  CalculationParametersFacade,
  ProductSelectionFacade,
} from '../../facades';
import {
  CalculationParametersOperationConditions,
  LoadCaseData,
} from '../../models';
import { DownstreamCalculationEffects } from './downstream-calculation.effects';

jest.mock('@ea/shared/helper/downstream-error-helper', () => ({
  parseErrorObject: jest.fn(() => ['test error']),
}));

const downstreamCalculationServiceMock = {
  getDownstreamCalculation: jest.fn(),
};

const downstreamCalculationInputsServiceMock = {
  formatDownstreamInputs: jest.fn(),
};

describe('DownstreamCalculationEffects', () => {
  let spectator: SpectatorService<DownstreamCalculationEffects>;
  let actions$: any;
  let action: any;
  let effects: DownstreamCalculationEffects;

  const operatingConditionsWithType = (
    type: CalculationParametersOperationConditions['lubrication']['lubricationSelection']
  ) =>
    ({
      lubrication: {
        lubricationSelection: type,
        greaseType: 'grease',
        grease: {
          selection: 'typeOfGrease',
          typeOfGrease: {
            typeOfGrease: 'LB_FAG_MULTI_2',
          },
        },
        oilBath: {
          viscosity: {
            ny40: undefined,
            ny100: undefined,
          },
        },
        oilMist: {
          isoVgClass: {
            isoVgClass: 150,
          },
        },
        recirculatingOil: {
          selection: 'viscosity',
          viscosity: {
            ny40: 20,
            ny100: 50,
          },
          oilFlow: 20,
          oilTemperatureDifference: 50,
          externalHeatFlow: 45,
        },
      },
      energySource: {
        type: 'fossil',
        fossil: {
          fossilOrigin: 'LB_DIESEL_FOSSIL',
        },
      },
      time: 786,
      ambientTemperature: 50,
      conditionOfRotation: 'innerring',
    }) as unknown as Partial<CalculationParametersOperationConditions> as CalculationParametersOperationConditions;

  const loadcaseData: LoadCaseData = {
    load: {
      axialLoad: 20,
      radialLoad: 30,
    },
    rotation: {
      typeOfMotion: 'LB_ROTATING',
      rotationalSpeed: undefined,
      shiftFrequency: undefined,
      shiftAngle: undefined,
    },
    operatingTemperature: 70,
    operatingTime: 40,
    loadCaseName: 'Loadcase 1',
  };

  const operatingConditionsSubject$ =
    new ReplaySubject<CalculationParametersOperationConditions>();

  const loadcasesSubject$ = new ReplaySubject<
    { loadcaseName: string; index: number }[]
  >();

  const createEffectService = createServiceFactory({
    service: DownstreamCalculationEffects,
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingDesignation$: of('bearing-123'),
        },
      },
      {
        provide: CalculationParametersFacade,
        useValue: {
          getLoadcases$: loadcasesSubject$.asObservable(),
          operationConditions$: operatingConditionsSubject$.asObservable(),
        },
      },
      {
        provide: DownstreamCalculationService,
        useValue: downstreamCalculationServiceMock,
      },
      {
        provide: DownstreamCalculationInputsService,
        useValue: downstreamCalculationInputsServiceMock,
      },
    ],
  });

  beforeEach(() => {
    spectator = createEffectService();
    actions$ = spectator.inject(Actions);

    effects = spectator.inject(DownstreamCalculationEffects);
    loadcasesSubject$.next([]);
  });

  describe('fetchDownstreamCalculation', () => {
    let fetchSpy: jest.SpyInstance;
    let formatInputSpy: jest.SpyInstance;

    const assertFetchDownstreamCalculation = (
      m: Context,
      a: ReturnType<
        typeof CO2DownstreamCalculationActions.fetchDownstreamCalculation
      >
    ) => {
      const expected = m.cold('-b', {
        b: CO2DownstreamCalculationActions.setDownstreamCalculationResult({
          result: 'result-from-service' as any,
          inputs: 'inputs-from-service' as any,
        }),
      });

      actions$ = m.hot('-a', { a });

      m.expect(effects.fetchDownstreamCalculation$).toBeObservable(expected);
      m.flush();

      expect(fetchSpy).toHaveBeenCalled();
      expect(fetchSpy.mock.calls).toMatchSnapshot();

      expect(formatInputSpy).toBeCalled();
    };

    beforeEach(() => {
      downstreamCalculationServiceMock.getDownstreamCalculation.mockReset();
      downstreamCalculationInputsServiceMock.formatDownstreamInputs.mockReset();

      fetchSpy = jest
        .spyOn(downstreamCalculationServiceMock, 'getDownstreamCalculation')
        .mockImplementation(() => of('result-from-service'));

      formatInputSpy = jest
        .spyOn(downstreamCalculationInputsServiceMock, 'formatDownstreamInputs')
        .mockImplementation(() => 'inputs-from-service');
    });

    afterEach(() => {
      fetchSpy.mockReset();
    });

    describe('when grease lubrication type is selected', () => {
      beforeEach(() => {
        operatingConditionsSubject$.next(operatingConditionsWithType('grease'));
      });

      it('should fetch the downstream calculation', () =>
        marbles((m) => {
          action = CO2DownstreamCalculationActions.fetchDownstreamCalculation();
          assertFetchDownstreamCalculation(m, action);
        })());
    });

    describe('when oilBath lubrication type is selected', () => {
      beforeEach(() => {
        operatingConditionsSubject$.next(
          operatingConditionsWithType('oilBath')
        );
      });

      it('should fetch the downstream calculation', () =>
        marbles((m) => {
          action = CO2DownstreamCalculationActions.fetchDownstreamCalculation();
          assertFetchDownstreamCalculation(m, action);
        })());
    });

    describe('when oilMist lubrication type is selected', () => {
      beforeEach(() => {
        operatingConditionsSubject$.next(
          operatingConditionsWithType('oilMist')
        );
      });

      it('should fetch the downstream calculation', () =>
        marbles((m) => {
          action = CO2DownstreamCalculationActions.fetchDownstreamCalculation();
          assertFetchDownstreamCalculation(m, action);
        })());
    });

    describe('when recirculatingOil lubrication type is selected', () => {
      beforeEach(() => {
        operatingConditionsSubject$.next(
          operatingConditionsWithType('recirculatingOil')
        );
      });

      it('should fetch the downstream calculation', () =>
        marbles((m) => {
          action = CO2DownstreamCalculationActions.fetchDownstreamCalculation();
          assertFetchDownstreamCalculation(m, action);
        })());
    });

    describe('when recirculatingOil lubrication type with isoVGClas and electic sources is selected', () => {
      beforeEach(() => {
        const base = operatingConditionsWithType('recirculatingOil');
        operatingConditionsSubject$.next({
          ...base,
          lubrication: {
            ...base.lubrication,
            recirculatingOil: {
              ...base.lubrication.recirculatingOil,
              selection: 'isoVgClass',
              isoVgClass: {
                isoVgClass: 50,
              },
              oilFlow: 20,
              oilTemperatureDifference: 30,
              externalHeatFlow: 15,
            },
          },
          energySource: {
            electric: {
              electricityRegion: 'LB_ARGENTINA',
            },
            type: 'electric',
          },
        });
      });

      it('should fetch the downstream calculation', () =>
        marbles((m) => {
          action = CO2DownstreamCalculationActions.fetchDownstreamCalculation();
          assertFetchDownstreamCalculation(m, action);
        })());
    });

    describe('when single loadcase is provided', () => {
      beforeEach(() => {
        operatingConditionsSubject$.next({
          ...operatingConditionsWithType('grease'),
          loadCaseData: [
            {
              ...loadcaseData,
            },
          ],
        });
        loadcasesSubject$.next([
          {
            loadcaseName: 'Cool loadcase 1',
            index: 0,
          },
        ]);
      });

      it('should fetch the downstream calculation', () =>
        marbles((m) => {
          action = CO2DownstreamCalculationActions.fetchDownstreamCalculation();
          assertFetchDownstreamCalculation(m, action);
        })());
    });

    describe('when multiple loadcases are provided', () => {
      beforeEach(() => {
        operatingConditionsSubject$.next({
          ...operatingConditionsWithType('grease'),
          lubrication: {
            ...operatingConditionsWithType('grease').lubrication,
            grease: {
              selection: 'isoVgClass',

              isoVgClass: {
                isoVgClass: 10,
              },
            } as Partial<
              CalculationParametersOperationConditions['lubrication']['grease']
            > as CalculationParametersOperationConditions['lubrication']['grease'],
          },
          loadCaseData: [
            {
              ...loadcaseData,
            },
            {
              ...loadcaseData,
              load: {
                axialLoad: undefined,
                radialLoad: undefined,
              },
            },
          ],
        });
        loadcasesSubject$.next([
          {
            loadcaseName: 'Cool loadcase 1',
            index: 0,
          },
          {
            loadcaseName: 'Cool loadcase 2',
            index: 1,
          },
        ]);
      });

      it('should fetch the downstream calculation', () =>
        marbles((m) => {
          action = CO2DownstreamCalculationActions.fetchDownstreamCalculation();
          assertFetchDownstreamCalculation(m, action);
        })());
    });

    describe('when type is undefined', () => {
      beforeEach(() => {
        operatingConditionsSubject$.next(
          operatingConditionsWithType(undefined)
        );
      });

      it('should handle gracefully', () =>
        marbles((m) => {
          action = CO2DownstreamCalculationActions.fetchDownstreamCalculation();
          assertFetchDownstreamCalculation(m, action);
        })());
    });

    describe('when downstream service returns error', () => {
      beforeEach(() => {
        operatingConditionsSubject$.next({
          ...operatingConditionsWithType('grease'),
        });
      });

      it(
        'should dispatch setCalculationFailure action on error',
        marbles((m) => {
          const errorResponse = new HttpErrorResponse({
            error: { title: 'Test Error' },
            status: 500,
          });

          downstreamCalculationServiceMock.getDownstreamCalculation.mockReturnValueOnce(
            throwError(() => errorResponse)
          );

          const fetchAction =
            CO2DownstreamCalculationActions.fetchDownstreamCalculation();
          const completion =
            CO2DownstreamCalculationActions.setCalculationFailure({
              errors: ['test error'],
            });

          actions$ = m.hot('-a', { a: fetchAction });
          const expected = m.cold('-b', { b: completion });

          m.expect(effects.fetchDownstreamCalculation$).toBeObservable(
            expected
          );
        })
      );
    });
  });
});
