import { MatSnackBarModule } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { CO2Service } from '@ea/core/services/co2.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CalculationResultActions } from '../../actions';
import { CalculationParametersFacade } from '../../facades';
import { CalculationResultFacade } from '../../facades/calculation-result/calculation-result.facade';
import { CalculationResult } from '../../models';
import { CalculationResultEffects } from './calculation-result.effects';

const co2ServiceMock = {
  createModel: jest.fn(),
  updateModel: jest.fn(),
  calculateModel: jest.fn(),
  getCalculationResult: jest.fn(),
};

describe('Calculation Result Effects', () => {
  let action: any;
  let actions$: any;
  let effects: CalculationResultEffects;
  let spectator: SpectatorService<CalculationResultEffects>;

  let calculationResultFacade: CalculationResultFacade;

  const createService = createServiceFactory({
    service: CalculationResultEffects,
    imports: [MatSnackBarModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: CO2Service,
        useValue: co2ServiceMock,
      },
      {
        provide: CalculationParametersFacade,
        useValue: {
          bearingDesignation$: of('bearing-123'),
          energySource$: of('energy-123'),
          operationConditions$: of('conditions-123'),
        },
      },
      {
        provide: CalculationResultFacade,
        useValue: {
          modelId$: of('modelId-123'),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CalculationResultEffects);
    calculationResultFacade = spectator.inject(CalculationResultFacade);
  });

  describe('createModel$', () => {
    beforeEach(() => {
      co2ServiceMock.createModel.mockReset();
    });
    it('should create model by setting model id in store', () => {
      calculationResultFacade.modelId$ = of(undefined);

      const createModelSpy = jest
        .spyOn(co2ServiceMock, 'createModel')
        .mockImplementation(() => of('model-id-from-service'));

      return marbles((m) => {
        action = CalculationResultActions.createModel();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: CalculationResultActions.setModelId({
            modelId: 'model-id-from-service',
          }),
          c: CalculationResultActions.updateModel(),
        });

        m.expect(effects.createModel$).toBeObservable(expected);
        m.flush();

        expect(createModelSpy).toHaveBeenCalled();
      })();
    });

    it('should use the same model id if already set in store', () => {
      calculationResultFacade.modelId$ = of('existing-id');

      const createModelSpy = jest
        .spyOn(co2ServiceMock, 'createModel')
        .mockImplementation(() => of('model-id-from-service'));

      return marbles((m) => {
        action = CalculationResultActions.createModel();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: CalculationResultActions.setModelId({
            modelId: 'existing-id',
          }),
          c: CalculationResultActions.updateModel(),
        });

        m.expect(effects.createModel$).toBeObservable(expected);
        m.flush();

        expect(createModelSpy).not.toHaveBeenCalled();
      })();
    });
  });

  describe('updateModel$', () => {
    it('should update the model', () => {
      const updateModelSpy = jest
        .spyOn(co2ServiceMock, 'updateModel')
        .mockImplementation(() => of('abc'));

      return marbles((m) => {
        action = CalculationResultActions.updateModel();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: CalculationResultActions.calculateModel(),
        });

        m.expect(effects.updateModel$).toBeObservable(expected);
        m.flush();

        expect(updateModelSpy).toHaveBeenCalled();
      })();
    });
  });

  describe('calculateModel$', () => {
    it('should calculate the model', () => {
      const calculateModelSpy = jest
        .spyOn(co2ServiceMock, 'calculateModel')
        .mockImplementation(() => of('abc'));

      return marbles((m) => {
        action = CalculationResultActions.calculateModel();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: CalculationResultActions.setCalculationId({
            calculationId: 'abc',
          }),
          c: CalculationResultActions.fetchCalculationResult(),
        });

        m.expect(effects.calculateModel$).toBeObservable(expected);
        m.flush();

        expect(calculateModelSpy).toHaveBeenCalled();
      })();
    });
  });

  describe('fetchCalculationResult$', () => {
    it('should fetch the calculation result', () => {
      calculationResultFacade.modelId$ = of('123');
      calculationResultFacade.calculationId$ = of('123');

      const getCalculationResultSpy = jest
        .spyOn(co2ServiceMock, 'getCalculationResult')
        .mockImplementation(() => of('abc-result'));

      return marbles((m) => {
        action = CalculationResultActions.fetchCalculationResult();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: CalculationResultActions.setCalculationResult({
            calculationResult: 'abc-result' as unknown as CalculationResult,
          }),
        });

        m.expect(effects.fetchCalculationResult$).toBeObservable(expected);
        m.flush();

        expect(getCalculationResultSpy).toHaveBeenCalled();
      })();
    });
  });
});
