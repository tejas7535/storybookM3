import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CalculationOptionsActions } from '../actions';
import { CalculationResultActions } from '../actions/calculation-result';
import { CalculationResultReportInput } from '../models/calculation-result-report-input.model';
import {
  MountingTools,
  ReportMessages,
  ResultItem,
} from '../models/calculation-result-state.model';
import { CalculationResultSelector } from '../selectors';
import { APP_STATE_MOCK } from './../../../../testing/mocks/store/app-state.mock';
import { CalculationResultFacade } from './calculation-result.facade';
import { CalculationSelectionFacade } from './calculation-selection/calculation-selection.facade';

describe('CalculationResultFacade', () => {
  let spectator: SpectatorService<CalculationResultFacade>;
  let facade: CalculationResultFacade;
  let store: MockStore;
  let calculationSelectionFacade: jest.Mocked<CalculationSelectionFacade>;

  const createService = createServiceFactory({
    service: CalculationResultFacade,
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
      {
        provide: CalculationSelectionFacade,
        useValue: {
          resultStepIndex: jest.fn().mockReturnValue(4),
          setCurrentStep: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    store = spectator.inject(MockStore);
    calculationSelectionFacade = spectator.inject(
      CalculationSelectionFacade
    ) as jest.Mocked<CalculationSelectionFacade>;
  });

  it('should be created', () => {
    expect(spectator.service).toBeDefined();
  });

  it('should select getCalculationInputs$', () => {
    const mockInputs = [
      { input1: 'value1', input2: 'value2' },
    ] as Partial<CalculationResultReportInput> as CalculationResultReportInput[];
    store.overrideSelector(
      CalculationResultSelector.getCalculationInputs,
      mockInputs
    );

    expect(facade.calculationInputs()).toEqual(mockInputs);
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

  it('should select isResultAvailable signal', () => {
    const mockResultAvailable = true;
    store.overrideSelector(
      CalculationResultSelector.isResultAvailable,
      mockResultAvailable
    );

    expect(facade.isResultAvailable()).toBe(mockResultAvailable);
  });

  it('should dispatch calculateResultFromOptions action', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const mockResultStepIndex = 4;
    calculationSelectionFacade.resultStepIndex.mockReturnValue(
      mockResultStepIndex
    );

    facade.calculateResultFromForm();

    expect(calculationSelectionFacade.resultStepIndex).toHaveBeenCalled();
    expect(calculationSelectionFacade.setCurrentStep).toHaveBeenCalledWith(
      mockResultStepIndex
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationOptionsActions.setCalculationPerformed({ performed: true })
    );
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

  it('should select mountingRecommendations$', () => {
    const mockRecommendations = ['Recommendation 1', 'Recommendation 2'];
    store.overrideSelector(
      CalculationResultSelector.getMountingRecommendations,
      mockRecommendations
    );

    expect(facade.mountingRecommendations()).toEqual(mockRecommendations);
  });

  it('should select mountingTools', () => {
    const mockTools: MountingTools = {
      additionalTools: [],
      hydraulicNut: [],
      pumps: { title: 'Test Pumps', items: [] },
      locknut: [],
      sleeveConnectors: [],
    };
    store.overrideSelector(
      CalculationResultSelector.getMountingTools,
      mockTools
    );
    expect(facade.mountingTools()).toEqual(mockTools);
  });

  it('should select startPositions', () => {
    const mockPositions: ResultItem[] = [
      { abbreviation: 'pos1', value: '10', designation: '123', unit: 'kg' },
      { abbreviation: 'pos2', value: '20', designation: '234', unit: 'cm' },
    ];

    store.overrideSelector(
      CalculationResultSelector.getStartPositions,
      mockPositions
    );

    expect(facade.startPositions()).toEqual(mockPositions);
  });

  it('should select endPositions', () => {
    const mockPositions: ResultItem[] = [
      { abbreviation: 'pos1', value: '10', designation: '123', unit: 'kg' },
      { abbreviation: 'pos2', value: '20', designation: '234', unit: 'cm' },
    ];
    store.overrideSelector(
      CalculationResultSelector.getEndPositions,
      mockPositions
    );

    expect(facade.endPositions()).toEqual(mockPositions);
  });

  it('should dispatch calculateThermalResultFromOptions', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    facade.calculateThermalResultFromForm();

    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationOptionsActions.setCalculationPerformed({ performed: true })
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      CalculationResultActions.calculateThermalResultFromOptions()
    );
  });

  it('should select radialClearance', () => {
    const mockClearance: ResultItem[] = [
      {
        abbreviation: 'rc1',
        value: '5',
        designation: 'Clearance 1',
        unit: 'mm',
      },
    ];
    store.overrideSelector(
      CalculationResultSelector.getRadialClearance,
      mockClearance
    );
    expect(facade.radialClearance()).toEqual(mockClearance);
  });

  it('should select radialClearanceClasses', () => {
    const mockClasses: ResultItem[] = [
      { abbreviation: 'class1', value: 'C3', designation: 'Class 3', unit: '' },
    ];
    store.overrideSelector(
      CalculationResultSelector.getClearanceClasses,
      mockClasses
    );
    expect(facade.radialClearanceClasses()).toEqual(mockClasses);
  });

  it('should select temperatures', () => {
    const mockTemperatures: ResultItem[] = [
      {
        abbreviation: 'T1',
        value: '25.5',
        designation: 'Temperature 1',
        unit: '°C',
      },
    ];
    store.overrideSelector(
      CalculationResultSelector.getTemperatures,
      mockTemperatures
    );
    expect(facade.temperatures()).toEqual(mockTemperatures);
  });

  it('should select hasMountingTools', () => {
    const mockHasTools = true;
    store.overrideSelector(
      CalculationResultSelector.hasMountingTools,
      mockHasTools
    );
    expect(facade.hasMountingTools()).toBe(mockHasTools);
  });

  it('should select reportSelectionTypes', () => {
    const mockTypes: any[] = []; // Simplified for test
    store.overrideSelector(
      CalculationResultSelector.getReportSelectionTypes,
      mockTypes
    );

    expect(facade.reportSelectionTypes()).toEqual(mockTypes);
  });

  it('should select bearinxVersions$', (done) => {
    const mockVersions = 'v1.0.0';
    store.overrideSelector(CalculationResultSelector.getVersions, mockVersions);

    facade.bearinxVersions$.subscribe((versions) => {
      expect(versions).toEqual(mockVersions);
      done();
    });
  });
});
