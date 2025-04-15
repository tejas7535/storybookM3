import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CalculationOptionsActions } from '../actions';
import { CalculationResultReportInput } from '../models/calculation-result-report-input.model';
import {
  ReportMessages,
  ResultItem,
} from '../models/calculation-result-state.model';
import { CalculationResultSelector } from '../selectors';
import { APP_STATE_MOCK } from './../../../../testing/mocks/store/app-state.mock';
import { CalculationResultFacade } from './calculation-result.facade';

describe('CalculationResultFacade', () => {
  let spectator: SpectatorService<CalculationResultFacade>;
  let facade: CalculationResultFacade;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CalculationResultFacade,
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    store = spectator.inject(MockStore);
  });

  it('should be created', () => {
    expect(spectator.service).toBeDefined();
  });

  it('should select getCalculationInputs$', (done) => {
    const mockInputs = [
      { input1: 'value1', input2: 'value2' },
    ] as Partial<CalculationResultReportInput> as CalculationResultReportInput[];
    store.overrideSelector(
      CalculationResultSelector.getCalculationInputs,
      mockInputs
    );

    facade.getCalculationInputs$.subscribe((inputs) => {
      expect(inputs).toEqual(mockInputs);
      done();
    });
  });

  it('should select getCalulationMessages$', (done) => {
    const mockMessages = {
      warnings: ['Message 1', 'Message 2'],
      errors: [],
      notes: [],
    } as ReportMessages;

    store.overrideSelector(
      CalculationResultSelector.getCalculationMessages,
      mockMessages
    );

    facade.getCalulationMessages$.subscribe((messages) => {
      expect(messages).toEqual(mockMessages);
      done();
    });
  });

  it('should select isResultAvailable$', (done) => {
    const mockResultAvailable = true;
    store.overrideSelector(
      CalculationResultSelector.isResultAvailable,
      mockResultAvailable
    );

    facade.isResultAvailable$.subscribe((isAvailable) => {
      expect(isAvailable).toBe(mockResultAvailable);
      done();
    });
  });

  it('should dispatch calculateResultFromOptions action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    facade.calculateResultFromForm();

    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationOptionsActions.calculateResultFromOptions()
    );
  });

  it('should select isLoading$', (done) => {
    const mockLoading = true;
    store.overrideSelector(CalculationResultSelector.isLoading, mockLoading);

    facade.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBe(mockLoading);
      done();
    });
  });

  it('should select mountingRecommendations$', (done) => {
    const mockRecommendations = ['Recommendation 1', 'Recommendation 2'];
    store.overrideSelector(
      CalculationResultSelector.getMountingRecommendations,
      mockRecommendations
    );

    facade.mountingRecommendations$.subscribe((recommendations) => {
      expect(recommendations).toEqual(mockRecommendations);
      done();
    });
  });

  it('should select startPositions$', (done) => {
    const mockPositions: ResultItem[] = [
      { abbreviation: 'pos1', value: '10', designation: '123', unit: 'kg' },
      { abbreviation: 'pos2', value: '20', designation: '234', unit: 'cm' },
    ];

    store.overrideSelector(
      CalculationResultSelector.getStartPositions,
      mockPositions
    );

    facade.startPositions$.subscribe((positions) => {
      expect(positions).toEqual(mockPositions);
      done();
    });
  });

  it('should select endPositions$', (done) => {
    const mockPositions: ResultItem[] = [
      { abbreviation: 'pos1', value: '10', designation: '123', unit: 'kg' },
      { abbreviation: 'pos2', value: '20', designation: '234', unit: 'cm' },
    ];
    store.overrideSelector(
      CalculationResultSelector.getEndPositions,
      mockPositions
    );

    facade.endPositions$.subscribe((positions) => {
      expect(positions).toEqual(mockPositions);
      done();
    });
  });
});
