import { BehaviorSubject, of } from 'rxjs';

import { GlobalSelectionStatus } from '../../../feature/global-selection/model';
import { Stub } from '../../test/stub.class';
import {
  GlobalSelectionState,
  GlobalSelectionStateService,
} from './global-selection-state.service';

describe('GlobalSelectionStateService', () => {
  let service: GlobalSelectionStateService;
  let routerSpy: any;
  let storage: Storage;
  const initialState: GlobalSelectionState = {
    region: [],
    salesArea: [],
    sectorManagement: [],
    salesOrg: [],
    gkamNumber: [],
    customerNumber: [],
    materialClassification: [],
    sector: [],
    materialNumber: [],
    productionPlant: [],
    productionSegment: [],
    alertType: [],
  };

  beforeEach(() => {
    storage = sessionStorage;
    storage.removeItem(GlobalSelectionStateService.STORAGE_NAME);

    service = Stub.get<GlobalSelectionStateService>({
      component: GlobalSelectionStateService,
      providers: [Stub.getRouterProvider()],
    });
    routerSpy = service['router'];

    service.form().setValue(initialState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with an empty state', () => {
    expect(service.getState()).toEqual(initialState);
  });

  it('should reset the state', () => {
    service
      .form()
      .get('region')
      ?.setValue([{ id: '1', text: 'Test' }]);
    service.resetState();
    expect(service.getState().region).toEqual([]);
  });

  it('should save the state to storage', () => {
    const testState: GlobalSelectionState = {
      region: [{ id: '1', text: 'Test' }],
      salesArea: [],
      sectorManagement: [],
      salesOrg: [],
      gkamNumber: [],
      customerNumber: [],
      materialClassification: [],
      sector: [],
      materialNumber: [],
      productionPlant: [],
      productionSegment: [],
      alertType: [],
    };

    service.form().setValue(testState);
    service.saveState();
    const storedState = JSON.parse(
      storage.getItem(GlobalSelectionStateService.STORAGE_NAME) || '{}'
    );
    expect(storedState).toEqual(testState);
  });

  it('should check if the state is empty', () => {
    service.resetState();
    expect(service.isEmpty()).toBe(true);
    service
      .form()
      .get('region')
      ?.setValue([{ id: '1', text: 'Test' }]);
    expect(service.isEmpty()).toBe(false);
  });

  describe('getGlobalSelectionStatus', () => {
    it('should return DATA_NOTHING_SELECTED when state is empty', () => {
      const status = service.getGlobalSelectionStatus(
        { data: [] },
        undefined as any
      );
      expect(status).toBe(GlobalSelectionStatus.DATA_NOTHING_SELECTED);
    });

    it('should return DATA_NO_RESULTS when data is empty and state is not empty', () => {
      service
        .form()
        .get('region')
        ?.setValue([{ id: '1', text: 'Test' }]);
      const status = service.getGlobalSelectionStatus(
        { data: [] },
        undefined as any
      );
      expect(status).toBe(GlobalSelectionStatus.DATA_NO_RESULTS);
    });

    it('should return DATA_AVAILABLE when selectedCustomer and data are available', () => {
      service
        .form()
        .get('region')
        ?.setValue([{ id: '1', text: 'Test' }]);
      const status = service.getGlobalSelectionStatus(
        { data: [{ customerNumber: '123' }] },
        { customerNumber: '123' }
      );
      expect(status).toBe(GlobalSelectionStatus.DATA_AVAILABLE);
    });

    it('should return DATA_ERROR when none of the above conditions are met', () => {
      service
        .form()
        .get('region')
        ?.setValue([{ id: '1', text: 'Test' }]);
      const status = service.getGlobalSelectionStatus(
        { data: undefined },
        undefined as any
      );
      expect(status).toBe(GlobalSelectionStatus.DATA_ERROR);
    });
  });

  describe('navigateWithGlobalSelection', () => {
    it('should navigate to the specified path with the correct extras', () => {
      const path = '/test-path';
      const newGlobalSelection = { region: [{ id: '1', text: 'Test' }] };
      const extras = { state: { test: 'test' } };

      routerSpy.navigate.mockReturnValue(Promise.resolve(true));

      service
        .navigateWithGlobalSelection(path, newGlobalSelection, extras)
        .subscribe((result) => {
          expect(result).toBe(true);
          expect(routerSpy.navigate).toHaveBeenCalledWith([path], {
            ...extras,
            state: { ...extras.state, globalSelection: newGlobalSelection },
          });
        });
    });

    it('should reset state before navigation', () => {
      const resetStateSpy = jest.spyOn(service, 'resetState');
      routerSpy.navigate.mockReturnValue(Promise.resolve(true));

      service
        .navigateWithGlobalSelection('/test-path', undefined, {})
        .subscribe(() => {
          expect(resetStateSpy).toHaveBeenCalled();
        });
    });

    it('should call overrideState if newGlobalSelection is not empty', () => {
      const overrideStateSpy = jest.spyOn(service as any, 'overrideState');
      const newGlobalSelection = { region: [{ id: '1', text: 'Test' }] };
      routerSpy.navigate.mockReturnValue(Promise.resolve(true));

      service
        .navigateWithGlobalSelection('/test-path', newGlobalSelection, {})
        .subscribe(() => {
          expect(overrideStateSpy).toHaveBeenCalledWith(newGlobalSelection);
        });
    });

    it('should not call overrideState if newGlobalSelection is empty', () => {
      const overrideStateSpy = jest.spyOn(service as any, 'overrideState');
      routerSpy.navigate.mockReturnValue(Promise.resolve(true));

      service
        .navigateWithGlobalSelection('/test-path', undefined, {})
        .subscribe(() => {
          expect(overrideStateSpy).not.toHaveBeenCalled();
        });
    });
  });

  describe('handleQueryParams$', () => {
    it('should return EMPTY if params is null or empty', () => {
      const result$ = service.handleQueryParams$(null);
      result$.subscribe({
        next: () => {
          throw new Error('Expected EMPTY, but got a value');
        },
        complete: () => expect(true).toBe(true), // Expect completion for EMPTY
      });

      const result2$ = service.handleQueryParams$({});
      result2$.subscribe({
        next: () => {
          throw new Error('Expected EMPTY, but got a value');
        },
        complete: () => expect(true).toBe(true), // Expect completion for EMPTY
      });
    });
  });

  it('should set initial state from storage', () => {
    const storedState: GlobalSelectionState = {
      region: [{ id: '1', text: 'Test' }],
      salesArea: [],
      sectorManagement: [],
      salesOrg: [],
      gkamNumber: [],
      customerNumber: [],
      materialClassification: [],
      sector: [],
      materialNumber: [],
      productionPlant: [],
      productionSegment: [],
      alertType: [],
    };
    storage.setItem(
      GlobalSelectionStateService.STORAGE_NAME,
      JSON.stringify(storedState)
    );

    const newService = Stub.get<GlobalSelectionStateService>({
      component: GlobalSelectionStateService,
      providers: [Stub.getRouterProvider()],
    });

    expect(newService.getState()).toEqual(storedState);

    storage.removeItem(GlobalSelectionStateService.STORAGE_NAME);
  });

  it('should override state', () => {
    const overrideStateData = {
      region: [{ id: '2', value: 'Test2' }],
    };

    service['overrideState'](overrideStateData as any);
    expect(service.getState().region).toEqual(overrideStateData.region);
  });

  describe('resolveIds$', () => {
    let helperServiceSpy: any;
    let optionsServiceSpy: any;

    beforeEach(() => {
      helperServiceSpy = service['helperService'];
      optionsServiceSpy = service['optionsService'];

      helperServiceSpy.resolveFor2Characters = jest
        .fn()
        .mockReturnValue(of([{ selectableValue: { id: '1', text: 'Test' } }]));
      helperServiceSpy.resolveForText = jest
        .fn()
        .mockReturnValue(
          of([{ selectableValue: { id: '2', text: 'SalesArea' } }])
        );
      helperServiceSpy.resolveCustomerNumbers = jest
        .fn()
        .mockReturnValue(
          of([{ selectableValue: { id: '3', text: 'Customer' } }])
        );
      helperServiceSpy.resolveProductionSegment = jest
        .fn()
        .mockReturnValue(
          of([{ selectableValue: { id: '4', text: 'Segment' } }])
        );

      optionsServiceSpy.get = jest.fn().mockReturnValue({ options: [] });
    });

    it('should correctly resolve region ids', () => {
      (service as any).resolveIds$('region', ['1']).subscribe((result: any) => {
        expect(result).toEqual({ region: [{ id: '1', text: 'Test' }] });
        expect(helperServiceSpy.resolveFor2Characters).toHaveBeenCalledWith(
          ['1'],
          []
        );
      });
    });

    it('should correctly resolve salesArea ids', () => {
      (service as any)
        .resolveIds$('salesArea', ['2'])
        .subscribe((result: any) => {
          expect(result).toEqual({
            salesArea: [{ id: '2', text: 'SalesArea' }],
          });
          expect(helperServiceSpy.resolveForText).toHaveBeenCalledWith(
            ['2'],
            []
          );
        });
    });

    it('should correctly resolve customerNumber without options', () => {
      (service as any)
        .resolveIds$('customerNumber', ['3'])
        .subscribe((result: any) => {
          expect(result).toEqual({
            customerNumber: [{ id: '3', text: 'Customer' }],
          });
          expect(helperServiceSpy.resolveCustomerNumbers).toHaveBeenCalledWith([
            '3',
          ]);
          expect(optionsServiceSpy.get).not.toHaveBeenCalled();
        });
    });

    it('should correctly resolve productionSegment without options', () => {
      (service as any)
        .resolveIds$('productionSegment', ['4'])
        .subscribe((result: any) => {
          expect(result).toEqual({
            productionSegment: [{ id: '4', text: 'Segment' }],
          });
          expect(
            helperServiceSpy.resolveProductionSegment
          ).toHaveBeenCalledWith(['4']);
          expect(optionsServiceSpy.get).not.toHaveBeenCalled();
        });
    });

    it('should return empty array when no valid results are returned', () => {
      helperServiceSpy.resolveFor2Characters = jest
        .fn()
        .mockReturnValue(of([{ someOtherProperty: true }]));

      (service as any).resolveIds$('region', ['1']).subscribe((result: any) => {
        expect(result).toEqual({ region: [] });
      });
    });

    it('should handle unknown keys gracefully', () => {
      (service as any)
        .resolveIds$('unknownKey' as any, ['1'])
        .subscribe((result: any) => {
          expect(result).toEqual({ unknownKey: [] });
        });
    });
  });

  describe('handleQueryParams$ with detailed tests', () => {
    beforeEach(() => {
      service['optionsService'].loading$.next(false);
      jest
        .spyOn(service as any, 'resolveIds$')
        .mockImplementation((key, ids) => {
          const mockResult: any = {};
          mockResult[key as any] = [
            { id: (ids as any)[0], text: `Mock ${key}` },
          ] as any;

          return of(mockResult);
        });
    });

    it('should process single parameter', (done) => {
      const params = { region: '1' };

      service.handleQueryParams$(params).subscribe((result) => {
        expect(result).toBe(true);
        expect(service.getState().region).toEqual([
          { id: '1', text: 'Mock region' },
        ]);
        done();
      });
    });

    it('should process multiple parameters', (done) => {
      const params = { region: '1', salesArea: '2' };

      service.handleQueryParams$(params).subscribe((result) => {
        expect(result).toBe(true);
        expect(service.getState().region).toEqual([
          { id: '1', text: 'Mock region' },
        ]);
        expect(service.getState().salesArea).toEqual([
          { id: '2', text: 'Mock salesArea' },
        ]);
        done();
      });
    });

    it('should handle array of values', (done) => {
      const params = { region: ['1', '2'] };

      // Mock implementation for array of values
      (service as any).resolveIds$.mockImplementation((key: any, ids: any) => {
        const mockResult: any = {};
        mockResult[key] = ids.map((id: any) => ({
          id,
          text: `Mock ${key} ${id}`,
        }));

        return of(mockResult);
      });

      service.handleQueryParams$(params).subscribe((result) => {
        expect(result).toBe(true);
        expect(service.getState().region).toEqual([
          { id: '1', text: 'Mock region 1' },
          { id: '2', text: 'Mock region 2' },
        ]);
        done();
      });
    });

    it('should filter out invalid keys', (done) => {
      const params = { region: '1', invalidKey: '2' };

      service.handleQueryParams$(params).subscribe((result) => {
        expect(result).toBe(true);
        expect(service.getState().region).toEqual([
          { id: '1', text: 'Mock region' },
        ]);
        done();
      });
    });

    it('should wait for loading to complete', (done) => {
      const loadingSubject = new BehaviorSubject(true);
      service['optionsService'].loading$ = loadingSubject;

      const params = { region: '1' };
      let isCompleted = false;

      service.handleQueryParams$(params).subscribe({
        next: (result) => {
          isCompleted = true;
          expect(result).toBe(true);
          done();
        },
      });

      setTimeout(() => {
        expect(isCompleted).toBe(false);
        loadingSubject.next(false);
      }, 0);
    });
  });

  describe('overrideState with detailed tests', () => {
    it('should reset state before overriding', () => {
      const resetStateSpy = jest.spyOn(service, 'resetState');
      const overrideData = { region: [{ id: '1', text: 'Test' }] };

      service['overrideState'](overrideData as any);

      expect(resetStateSpy).toHaveBeenCalled();
    });

    it('should update form with new values', () => {
      const overrideData = {
        region: [{ id: '1', text: 'Region' }],
        salesArea: [{ id: '2', text: 'SalesArea' }],
      };

      service['overrideState'](overrideData as any);

      expect(service.getState().region).toEqual(overrideData.region);
      expect(service.getState().salesArea).toEqual(overrideData.salesArea);
    });

    it('should save state after overriding', () => {
      const saveStateSpy = jest.spyOn(service, 'saveState');
      const overrideData = { region: [{ id: '1', text: 'Test' }] };

      service['overrideState'](overrideData as any);

      expect(saveStateSpy).toHaveBeenCalled();
    });
  });
});
