import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { FrictionService } from '@ea/core/services/friction.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { FrictionCalculationResultActions } from '../../actions';
import { CalculationParametersFacade } from '../../facades';
import { FrictionCalculationResultFacade } from '../../facades/calculation-result/friction-calculation-result.facade';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';
import { FrictionCalculationResult } from '../../models';
import { FrictionCalculationResultEffects } from './friction-calculation-result.effects';

const frictionServiceMock = {
  createFrictionModel: jest.fn(),
  updateFrictionModel: jest.fn(),
  calculateFrictionModel: jest.fn(),
  getCalculationResult: jest.fn(),
};

describe('Friction Calculation Result Effects', () => {
  let action: any;
  let actions$: any;
  let effects: FrictionCalculationResultEffects;
  let spectator: SpectatorService<FrictionCalculationResultEffects>;

  let frictionCalculationResultFacade: FrictionCalculationResultFacade;
  let calculationParametersFacade: CalculationParametersFacade;

  const createService = createServiceFactory({
    service: FrictionCalculationResultEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: FrictionService,
        useValue: frictionServiceMock,
      },
      {
        provide: CalculationParametersFacade,
        useValue: {
          energySource$: of('energy-123'),
          operationConditions$: of('conditions-123'),
          isCalculationMissingInput$: of(false),
        },
      },
      {
        provide: FrictionCalculationResultFacade,
        useValue: {
          modelId$: of('modelId-123'),
        },
      },
      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingDesignation$: of('bearing-123'),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(FrictionCalculationResultEffects);
    frictionCalculationResultFacade = spectator.inject(
      FrictionCalculationResultFacade
    );
    calculationParametersFacade = spectator.inject(CalculationParametersFacade);
  });

  describe('createFrictionModel$', () => {
    beforeEach(() => {
      frictionServiceMock.createFrictionModel.mockReset();
    });
    it('should create model by setting model id in store', () => {
      frictionCalculationResultFacade.modelId$ = of(undefined);

      const createFrictionModelSpy = jest
        .spyOn(frictionServiceMock, 'createFrictionModel')
        .mockImplementation(() => of('model-id-from-service'));

      return marbles((m) => {
        action = FrictionCalculationResultActions.createModel({});
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: FrictionCalculationResultActions.setModelId({
            modelId: 'model-id-from-service',
          }),
          c: FrictionCalculationResultActions.updateModel(),
        });

        m.expect(effects.createModel$).toBeObservable(expected);
        m.flush();

        expect(createFrictionModelSpy).toHaveBeenCalled();
      })();
    });

    it('should use the same model id if already set in store', () => {
      frictionCalculationResultFacade.modelId$ = of('existing-id');

      const createFrictionModelSpy = jest
        .spyOn(frictionServiceMock, 'createFrictionModel')
        .mockImplementation(() => of('model-id-from-service'));

      return marbles((m) => {
        action = FrictionCalculationResultActions.createModel({});
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: FrictionCalculationResultActions.setModelId({
            modelId: 'existing-id',
          }),
          c: FrictionCalculationResultActions.updateModel(),
        });

        m.expect(effects.createModel$).toBeObservable(expected);
        m.flush();

        expect(createFrictionModelSpy).not.toHaveBeenCalled();
      })();
    });
  });

  describe('updateFrictionModel$', () => {
    beforeEach(() => {
      frictionServiceMock.updateFrictionModel.mockReset();
    });

    it('should update the model', () => {
      const updateFrictionModelSpy = jest
        .spyOn(frictionServiceMock, 'updateFrictionModel')
        .mockImplementation(() => of('abc'));

      return marbles((m) => {
        action = FrictionCalculationResultActions.updateModel();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: FrictionCalculationResultActions.calculateModel(),
        });

        m.expect(effects.updateModel$).toBeObservable(expected);
        m.flush();

        expect(updateFrictionModelSpy).toHaveBeenCalled();
      })();
    });

    it('should not update the model if calculation input is invalid', () => {
      calculationParametersFacade.isCalculationMissingInput$ = of(true);

      const updateFrictionModelSpy = jest
        .spyOn(frictionServiceMock, 'updateFrictionModel')
        .mockImplementation(() => of('abc'));

      return marbles((m) => {
        action = FrictionCalculationResultActions.updateModel();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: FrictionCalculationResultActions.setLoading({ isLoading: false }),
        });

        m.expect(effects.updateModel$).toBeObservable(expected);
        m.flush();

        expect(updateFrictionModelSpy).not.toHaveBeenCalled();
      })();
    });
  });

  describe('calculateFrictionModel$', () => {
    it('should calculate the model', () => {
      const calculateFrictionModelSpy = jest
        .spyOn(frictionServiceMock, 'calculateFrictionModel')
        .mockImplementation(() => of('abc'));

      return marbles((m) => {
        action = FrictionCalculationResultActions.calculateModel();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: FrictionCalculationResultActions.setCalculationId({
            calculationId: 'abc',
          }),
          c: FrictionCalculationResultActions.fetchCalculationResult(),
        });

        m.expect(effects.calculateModel$).toBeObservable(expected);
        m.flush();

        expect(calculateFrictionModelSpy).toHaveBeenCalled();
      })();
    });
  });

  describe('fetchFrictionCalculationResult$', () => {
    it('should fetch the calculation result', () => {
      frictionCalculationResultFacade.modelId$ = of('123');
      frictionCalculationResultFacade.calculationId$ = of('123');

      const getCalculationResultSpy = jest
        .spyOn(frictionServiceMock, 'getCalculationResult')
        .mockImplementation(() => of('abc-result'));

      return marbles((m) => {
        action = FrictionCalculationResultActions.fetchCalculationResult();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: FrictionCalculationResultActions.setCalculationResult({
            calculationResult:
              'abc-result' as unknown as FrictionCalculationResult,
          }),
        });

        m.expect(effects.fetchCalculationResult$).toBeObservable(expected);
        m.flush();

        expect(getCalculationResultSpy).toHaveBeenCalled();
      })();
    });
  });
});
