/* eslint-disable unicorn/no-useless-undefined */
import { signal } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { CalculationResultFacade } from '@mm/core/store/facades/calculation-result.facade';
import { CalculationSelectionFacade } from '@mm/core/store/facades/calculation-selection/calculation-selection.facade';
import {
  MountingTools,
  PumpItem,
  ReportMessages,
  ResultItem,
} from '@mm/core/store/models/calculation-result-state.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ResultDataService } from './result-data.service';

describe('ResultDataService', () => {
  let spectator: SpectatorService<ResultDataService>;
  let service: ResultDataService;

  const selectedBearingOptionSignal = signal({
    title: 'Test Bearing',
    id: 'test-id',
  });

  const calculationInputsSignal = signal([{ key: 'input1', value: 'value1' }]);
  const mountingRecommendationsSignal = signal<string[]>([
    'recommendation1',
    'recommendation2',
  ]);
  const radialClearanceSignal = signal<ResultItem[]>([
    {
      value: 'clearance1',
      unit: 'mm',
      abbreviation: 'c',
      designation: 'Clearance 1',
    },
  ]);
  const radialClearanceClassesSignal = signal<ResultItem[]>([
    {
      value: 'class1',
      unit: '',
      abbreviation: 'cl',
      designation: 'Class 1',
    },
  ]);
  const startPositionsSignal = signal<ResultItem[]>([
    {
      value: 'pos1',
      unit: 'mm',
      abbreviation: 'p',
      designation: 'Position 1',
      isImportant: true,
    },
  ]);
  const endPositionsSignal = signal<ResultItem[]>([
    {
      value: 'end1',
      unit: 'mm',
      abbreviation: 'e',
      designation: 'End 1',
      isImportant: false,
    },
  ]);
  const hasMountingToolsSignal = signal<boolean>(true);

  const pumpItems: PumpItem[] = [
    {
      value: 'PUMP1',
      isRecommended: true,
      field: 'Pump 1',
    },
    {
      value: 'PUMP2',
      isRecommended: false,
      field: 'Pump 2',
    },
    {
      value: 'PUMP3',
      isRecommended: false,
      field: 'Pump 3',
    },
  ];

  const defaultMountingTools: MountingTools = {
    additionalTools: [],
    hydraulicNut: [
      {
        value: 'HN123',
        unit: '',
        abbreviation: 'HN',
        designation: 'Hydraulic Nut 123',
      },
    ],
    locknut: [],
    pumps: {
      title: 'Test Pumps',
      items: pumpItems,
    },
    sleeveConnectors: [
      {
        value: 'SC1',
        unit: '',
        abbreviation: 'SC',
        designation: 'Sleeve Connector 1',
      },
    ],
  };

  const mountingToolsSignal = signal<MountingTools>(defaultMountingTools);

  const messagesSubject = new BehaviorSubject<ReportMessages>({
    errors: ['Error 1'],
    warnings: ['Warning 1'],
    notes: ['Note 1'],
  });

  const bearingVersionsSubject = new BehaviorSubject<string>('v1.0.0');
  const reportSelectionTypesSignal = signal<string[]>(['type1', 'type2']);
  const isResultAvailableSignal = signal<boolean>(true);
  const temperaturesSignal = signal<ResultItem[]>([
    {
      value: '25.5',
      unit: '°C',
      abbreviation: 'T',
      designation: 'Temperature 1',
    },
  ]);

  const createService = createServiceFactory({
    service: ResultDataService,
    providers: [
      {
        provide: CalculationResultFacade,
        useValue: {
          calculationInputs: calculationInputsSignal,
          mountingRecommendations: mountingRecommendationsSignal,
          radialClearance: radialClearanceSignal,
          radialClearanceClasses: radialClearanceClassesSignal,
          startPositions: startPositionsSignal,
          endPositions: endPositionsSignal,
          hasMountingTools: hasMountingToolsSignal,
          mountingTools: mountingToolsSignal,
          getCalulationMessages$: messagesSubject.asObservable(),
          bearinxVersions$: bearingVersionsSubject.asObservable(),
          reportSelectionTypes: reportSelectionTypesSignal,
          isResultAvailable: isResultAvailableSignal,
          temperatures: temperaturesSignal,
        },
      },
      {
        provide: CalculationSelectionFacade,
        useValue: {
          selectedBearingOption: selectedBearingOptionSignal,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('selectedBearing', () => {
    it('should return the title of the selected bearing option', () => {
      expect(service.selectedBearing()).toBe('Test Bearing');

      // Update the subject value
      selectedBearingOptionSignal.set({ title: 'New Bearing', id: 'new-id' });
      expect(service.selectedBearing()).toBe('New Bearing');
    });

    it('should return undefined when no bearing is selected', () => {
      selectedBearingOptionSignal.set(undefined);
      expect(service.selectedBearing()).toBeUndefined();
    });
  });

  describe('Signals from calculation result facade', () => {
    it('should correctly expose inputs signal', () => {
      expect(service.inputs()).toEqual([{ key: 'input1', value: 'value1' }]);

      const newInputs = [{ key: 'input2', value: 'value2' }];
      calculationInputsSignal.set(newInputs);
      expect(service.inputs()).toEqual(newInputs);
    });

    it('should correctly expose mountingRecommendations signal', () => {
      expect(service.mountingRecommendations()).toEqual([
        'recommendation1',
        'recommendation2',
      ]);

      const newRecommendations = ['new recommendation'];
      mountingRecommendationsSignal.set(newRecommendations);
      expect(service.mountingRecommendations()).toEqual(newRecommendations);
    });

    it('should correctly expose radialClearance signal', () => {
      expect(service.radialClearance()[0].value).toBe('clearance1');

      const newClearance = [
        {
          value: 'newClearance',
          unit: 'mm',
          abbreviation: 'c',
          designation: 'New Clearance',
        },
      ];
      radialClearanceSignal.set(newClearance);
      expect(service.radialClearance()).toEqual(newClearance);
    });

    it('should correctly expose clearanceClasses signal', () => {
      expect(service.clearanceClasses()[0].value).toBe('class1');

      const newClasses = [
        {
          value: 'newClass',
          unit: '',
          abbreviation: 'nc',
          designation: 'New Class',
        },
      ];
      radialClearanceClassesSignal.set(newClasses);
      expect(service.clearanceClasses()).toEqual(newClasses);
    });

    it('should correctly expose startPositions signal', () => {
      expect(service.startPositions()[0].value).toBe('pos1');

      const newPositions = [
        {
          value: 'newPos',
          unit: 'mm',
          abbreviation: 'np',
          designation: 'New Position',
          isImportant: true,
        },
      ];
      startPositionsSignal.set(newPositions);

      expect(service.startPositions()).toEqual(newPositions);
    });

    it('should correctly expose endPositions signal', () => {
      expect(service.endPositions()[0].value).toBe('end1');

      const newPositions = [
        {
          value: 'newEnd',
          unit: 'mm',
          abbreviation: 'ne',
          designation: 'New End',
          isImportant: false,
        },
      ];
      endPositionsSignal.set(newPositions);
      expect(service.endPositions()).toEqual(newPositions);
    });

    it('should correctly expose hasMountingTools signal', () => {
      expect(service.hasMountingTools()).toBe(true);

      hasMountingToolsSignal.set(false);
      expect(service.hasMountingTools()).toBe(false);
    });

    it('should correctly expose temperatures signal', () => {
      expect(service.temperatures()[0].value).toBe('25.5');
      expect(service.temperatures()[0].unit).toBe('°C');

      const newTemperatures = [
        {
          value: '30.2',
          unit: '°C',
          abbreviation: 'T',
          designation: 'Temperature 2',
        },
      ];
      temperaturesSignal.set(newTemperatures);
      expect(service.temperatures()).toEqual(newTemperatures);
    });
  });

  describe('Computed values', () => {
    it('should correctly filter alternativePumps', () => {
      // The initial mock has two non-recommended pumps
      const alternativePumps = service.alternativePumps();
      expect(alternativePumps.length).toBe(2);
      expect(alternativePumps[0].value).toBe('PUMP2');
      expect(alternativePumps[1].value).toBe('PUMP3');

      const updatedPumpItems: PumpItem[] = [
        {
          value: 'PUMP1',
          isRecommended: true,
          field: 'test',
        },
        {
          value: 'PUMP2',
          isRecommended: true,
          field: 'Pump 2',
        },
        {
          value: 'PUMP3',
          isRecommended: false,
          field: 'Pump 3',
        },
      ];

      const updatedTools = {
        ...mountingToolsSignal(),
        pumps: {
          title: 'Updated Pumps',
          items: updatedPumpItems,
        },
      };

      mountingToolsSignal.set(updatedTools);

      expect(service.alternativePumps().length).toBe(1);
      expect(service.alternativePumps()[0].value).toBe('PUMP3');
    });

    it('should correctly identify recommendedPump', () => {
      expect(service.recommendedPump().value).toBe('PUMP1');

      const noneRecommendedPumpItems: PumpItem[] = [
        {
          value: 'PUMP1',
          isRecommended: false,
          field: 'Pump 1',
        },
        {
          value: 'PUMP2',
          isRecommended: false,
          field: 'Pump 2',
        },
      ];

      const updatedTools = {
        ...mountingToolsSignal(),
        pumps: {
          title: 'Updated Pumps',
          items: noneRecommendedPumpItems,
        },
      };

      mountingToolsSignal.set(updatedTools);

      expect(service.recommendedPump()).toBeUndefined();
    });

    it('should correctly identify the nutItem', () => {
      const hydraulicNut: ResultItem[] = [];
      const locknut: ResultItem[] = [];
      expect(service.nutItem().value).toBe('HN123');

      const updatedTools = {
        ...mountingToolsSignal(),
        hydraulicNut,
        locknut: [
          {
            value: 'LN456',
            unit: '',
            abbreviation: 'LN',
            designation: 'Lock Nut 456',
          },
        ],
      };
      mountingToolsSignal.set(updatedTools);

      expect(service.nutItem().value).toBe('LN456');

      const noNutsTools = {
        ...mountingToolsSignal(),
        hydraulicNut,
        locknut,
      };
      mountingToolsSignal.set(noNutsTools);

      expect(service.nutItem()).toBeUndefined();
    });

    it('should correctly return sleeveConnectors', () => {
      expect(service.sleeveConnectors().length).toBe(1);
      expect(service.sleeveConnectors()[0].value).toBe('SC1');

      const updatedTools = {
        ...mountingToolsSignal(),
        sleeveConnectors: [
          {
            value: 'SC1',
            unit: '',
            abbreviation: 'SC',
            designation: 'Sleeve Connector 1',
          },
          {
            value: 'SC2',
            unit: '',
            abbreviation: 'SC',
            designation: 'Sleeve Connector 2',
          },
        ],
      };
      mountingToolsSignal.set(updatedTools);

      expect(service.sleeveConnectors().length).toBe(2);
      expect(service.sleeveConnectors()[1].value).toBe('SC2');

      const emptySleeveConnectors: ResultItem[] = [];

      const noConnectorsTools = {
        ...mountingToolsSignal(),
        sleeveConnectors: emptySleeveConnectors,
      };
      mountingToolsSignal.set(noConnectorsTools);

      expect(service.sleeveConnectors().length).toBe(0);
    });

    describe('when products images are id are available', () => {
      beforeEach(() => {
        mountingToolsSignal.set(defaultMountingTools);
      });
      it('should correctly collect imageProductsIds', () => {
        const initialIds = service.imageProductsIds();

        expect(initialIds.length).toBe(4);
        expect(initialIds).toContain('HN123');
        expect(initialIds).toContain('PUMP1');
        expect(initialIds).toContain('PUMP2');
        expect(initialIds).toContain('PUMP3');
      });
    });

    describe('when no products images ids are missing', () => {
      beforeEach(() => {
        const emptyValueHydraulicNut = [
          {
            value: '',
            unit: '',
            abbreviation: 'HN',
            designation: 'Hydraulic Nut Empty',
          },
        ];

        const emptyPumpItems: PumpItem[] = [
          {
            isRecommended: true,
            field: 'Pump 1',
            value: undefined,
          },
        ];

        const sleeveConnectors: ResultItem[] = [];

        const missingValuesTools = {
          ...mountingToolsSignal(),
          hydraulicNut: emptyValueHydraulicNut,
          pumps: {
            title: 'Test Pumps',
            items: emptyPumpItems,
          },
          sleeveConnectors,
        };

        mountingToolsSignal.set(missingValuesTools);
      });

      it('should not have values', () => {
        expect(service.imageProductsIds().length).toBe(0);
      });
    });

    it('should correctly combine messages', () => {
      const initialMessages = service.messages();

      expect(initialMessages.length).toBe(4);
      expect(initialMessages).toContain('Error 1');
      expect(initialMessages).toContain('Warning 1');
      expect(initialMessages).toContain('Note 1');
      expect(initialMessages).toContain('v1.0.0');

      messagesSubject.next({
        errors: [],
        warnings: [],
        notes: [],
      });
      bearingVersionsSubject.next(undefined);

      expect(service.messages().length).toBe(0);

      messagesSubject.next({
        errors: ['New Error'],
        warnings: [],
        notes: [],
      });

      expect(service.messages().length).toBe(1);
      expect(service.messages()[0]).toBe('New Error');

      messagesSubject.next({
        errors: [],
        warnings: [],
        notes: [],
      });
      bearingVersionsSubject.next('v2.0.0');

      expect(service.messages().length).toBe(1);
      expect(service.messages()[0]).toBe('v2.0.0');
    });
  });
});
