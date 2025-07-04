import { QueryList } from '@angular/core';

import { Stub } from '../../../../shared/test/stub.class';
import { MultiAutocompletePreLoadedComponent } from '../../inputs/autocomplete/multi-autocomplete-pre-loaded/multi-autocomplete-pre-loaded.component';
import { PreLoadedAutocompleteWithMultiselectComponent } from '../pre-loaded-autocomplete-with-multiselect/pre-loaded-autocomplete-with-multiselect.component';
import { GlobalSelectionCriteriaComponent } from './global-selection-criteria.component';

describe('GlobalSelectionCriteriaComponent', () => {
  let component: GlobalSelectionCriteriaComponent;

  beforeEach(() => {
    component = Stub.get<GlobalSelectionCriteriaComponent>({
      component: GlobalSelectionCriteriaComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let loadCountSpy: jest.SpyInstance;
    let handleTasksSpy: jest.SpyInstance;

    beforeEach(() => {
      loadCountSpy = jest
        .spyOn<any, any>(component, 'loadCount')
        .mockImplementation(() => {});

      handleTasksSpy = jest
        .spyOn<any, any>(component, 'handleTasks')
        .mockImplementation(() => {});
    });

    it('should initialize isCollapsed based on globalSelectionStateService.isEmpty', () => {
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(true);

      component.ngOnInit();

      expect(component.isCollapsed()).toBe(false);
    });

    it('should emit onGlobalSelectionChange on initialization', () => {
      const emitSpy = jest.spyOn(component.onGlobalSelectionChange, 'emit');
      const mockGetFilters = jest
        .spyOn<any, any>(component, 'getFilters')
        .mockReturnValue({ someFilter: 'value' });

      component.ngOnInit();

      expect(emitSpy).toHaveBeenCalledWith({ someFilter: 'value' });
      expect(mockGetFilters).toHaveBeenCalled();
    });

    it('should call loadCount on initialization', () => {
      component.ngOnInit();

      expect(loadCountSpy).toHaveBeenCalled();
    });

    it('should call handleTasks on initialization', () => {
      component.ngOnInit();

      expect(handleTasksSpy).toHaveBeenCalled();
    });
  });

  describe('saveFilters', () => {
    it('should save state and emit values when filters are not empty', () => {
      const mockState = { regions: ['EU'] };
      const getFiltersSpy = jest
        .spyOn<any, any>(component, 'getFilters')
        .mockReturnValue(mockState);
      const saveStateSpy = jest.spyOn(
        component['globalSelectionStateService'],
        'saveState'
      );
      const isEmptySpy = jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(false);
      const emitSpy = jest.spyOn(component.onGlobalSelectionChange, 'emit');
      const loadCountSpy = jest.spyOn<any, any>(component, 'loadCount');

      component['saveFilters']();

      expect(getFiltersSpy).toHaveBeenCalled();
      expect(isEmptySpy).toHaveBeenCalled();
      expect(saveStateSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith(mockState);
      expect(loadCountSpy).toHaveBeenCalled();
    });

    it('should show snackbar and reset count when filters are empty', () => {
      const mockState = {};
      const getFiltersSpy = jest
        .spyOn<any, any>(component, 'getFilters')
        .mockReturnValue(mockState);
      const isEmptySpy = jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(true);
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');
      const countSetSpy = jest.spyOn(component.count, 'set');

      component['saveFilters']();

      expect(getFiltersSpy).toHaveBeenCalled();
      expect(isEmptySpy).toHaveBeenCalled();
      expect(snackbarSpy).toHaveBeenCalled();
      expect(countSetSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('resetFilters', () => {
    it('should reset state, emit null, and reset count', () => {
      const resetStateSpy = jest.spyOn(
        component['globalSelectionStateService'],
        'resetState'
      );
      const emitSpy = jest.spyOn(component.onGlobalSelectionChange, 'emit');
      const countSetSpy = jest.spyOn(component.count, 'set');

      component['resetFilters']();

      expect(resetStateSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith(null);
      expect(countSetSpy).toHaveBeenCalledWith(0);
    });

    it('should call onClear on all preLoadedComponents', () => {
      const mockComponent1 = { onClear: jest.fn() };
      const mockComponent2 = { onClear: jest.fn() };
      (component as any)['preLoadedComponents'] = {
        forEach: (callback: (item: any) => void) => {
          [mockComponent1, mockComponent2].forEach((element) => {
            callback(element);
          });
        },
      } as unknown as QueryList<MultiAutocompletePreLoadedComponent>;

      component['resetFilters']();

      expect(mockComponent1.onClear).toHaveBeenCalled();
      expect(mockComponent2.onClear).toHaveBeenCalled();
    });

    it('should call onClear on all preLoadedWithMultiselectComponents', () => {
      const mockComponent1 = { onClear: jest.fn() };
      const mockComponent2 = { onClear: jest.fn() };
      (component as any)['preLoadedWithMultiselectComponents'] = {
        forEach: (callback: (item: any) => void) => {
          [mockComponent1, mockComponent2].forEach((element) => {
            callback(element);
          });
        },
      } as unknown as QueryList<PreLoadedAutocompleteWithMultiselectComponent>;

      component['resetFilters']();

      expect(mockComponent1.onClear).toHaveBeenCalled();
      expect(mockComponent2.onClear).toHaveBeenCalled();
    });

    it('should handle undefined or empty component lists gracefully', () => {
      (component as any)['preLoadedComponents'] =
        undefined as unknown as QueryList<MultiAutocompletePreLoadedComponent>;
      (component as any)['preLoadedWithMultiselectComponents'] =
        undefined as unknown as QueryList<PreLoadedAutocompleteWithMultiselectComponent>;

      expect(() => component['resetFilters']()).not.toThrow();
    });
  });

  describe('loadCount', () => {
    it('should set count to 0 when filters are empty', () => {
      const mockState = {};
      const getFiltersSpy = jest
        .spyOn<any, any>(component, 'getFilters')
        .mockReturnValue(mockState);
      const isEmptySpy = jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(true);
      const countSetSpy = jest.spyOn(component.count, 'set');

      component['loadCount']();

      expect(getFiltersSpy).toHaveBeenCalled();
      expect(isEmptySpy).toHaveBeenCalled();
      expect(countSetSpy).toHaveBeenCalledWith(0);
    });

    it('should call getResultCount when filters are not empty and not already loading', () => {
      const mockState = { regions: ['EU'] };
      const getFiltersSpy = jest
        .spyOn<any, any>(component, 'getFilters')
        .mockReturnValue(mockState);
      const isEmptySpy = jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(false);
      const countLoadingSpy = jest.spyOn(component['countLoading'], 'set');

      const mockObservable = {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockImplementation((callback) => {
          callback(42);

          return { unsubscribe: jest.fn() };
        }),
      };

      const getResultCountSpy = jest
        .spyOn(component['globalSelectionHelperService'], 'getResultCount')
        .mockReturnValue(mockObservable as any);

      component['loadCount']();

      expect(getFiltersSpy).toHaveBeenCalled();
      expect(isEmptySpy).toHaveBeenCalled();
      expect(countLoadingSpy).toHaveBeenCalledWith(true);
      expect(getResultCountSpy).toHaveBeenCalledWith(mockState);
      expect(component.count()).toBe(42);
      expect(countLoadingSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('handleTasks', () => {
    it('should enable alertType control when options are available', () => {
      component['selectableOptionsService'].loading$.next(false);

      const getSpy = jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue({
          options: [{ id: '1', text: 'Option 1' }],
        });

      const enableSpy = jest.spyOn(
        component.globalForm.controls.alertType,
        'enable'
      );

      component['handleTasks']();

      expect(getSpy).toHaveBeenCalledWith('alertTypes');
      expect(enableSpy).toHaveBeenCalled();
    });

    it('should disable alertType control when no options are available', () => {
      component['selectableOptionsService'].loading$.next(false);

      const getSpy = jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue({
          options: [],
        });

      const disableSpy = jest.spyOn(
        component.globalForm.controls.alertType,
        'disable'
      );

      component['handleTasks']();

      expect(getSpy).toHaveBeenCalledWith('alertTypes');
      expect(disableSpy).toHaveBeenCalled();
    });
  });

  describe('text signal', () => {
    it('should return loading message when count is loading', () => {
      component['countLoading'].set(true);

      expect(component.text()).toContain('loading');
    });

    it('should return formatted count when not loading', () => {
      component['countLoading'].set(false);
      component.count.set(1000);
      jest
        .spyOn(component['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('1,000');

      expect(component.text()).toContain('1,000');
    });
  });

  describe('getFilters', () => {
    it('should return a copy of the state from globalSelectionStateService', () => {
      const mockState = { regions: ['EU'], categories: ['A', 'B'] } as any;
      const getStateSpy = jest
        .spyOn(component['globalSelectionStateService'], 'getState')
        .mockReturnValue(mockState);

      const result = component['getFilters']();

      expect(getStateSpy).toHaveBeenCalled();
      expect(result).toEqual(mockState);
      expect(result).not.toBe(mockState); // Should be a copy, not the same reference
    });
  });

  describe('loadCount edge cases', () => {
    it('should not call getResultCount when already loading', () => {
      const mockState = { regions: ['EU'] };
      jest.spyOn<any, any>(component, 'getFilters').mockReturnValue(mockState);
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(false);

      // Simulate already loading
      component['countLoading'].set(true);

      const getResultCountSpy = jest.spyOn(
        component['globalSelectionHelperService'],
        'getResultCount'
      );

      component['loadCount']();

      expect(getResultCountSpy).not.toHaveBeenCalled();
    });

    it('should handle null count value from getResultCount', () => {
      const mockState = { regions: ['EU'] };
      jest.spyOn<any, any>(component, 'getFilters').mockReturnValue(mockState);
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(false);

      const mockObservable = {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockImplementation((callback) => {
          callback(null); // API returned null

          return { unsubscribe: jest.fn() };
        }),
      };

      jest
        .spyOn(component['globalSelectionHelperService'], 'getResultCount')
        .mockReturnValue(mockObservable as any);

      const countSetSpy = jest.spyOn(component.count, 'set');

      component['loadCount']();

      expect(countSetSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('component interaction with child components', () => {
    it('should reset preLoaded components on resetFilters', () => {
      // Mock QueryList for preLoadedComponents
      const mockPreLoadedComponent1 = { onClear: jest.fn() };
      const mockPreLoadedComponent2 = { onClear: jest.fn() };
      (component as any)['preLoadedComponents'] = {
        forEach: (callback: (component: any) => void) => {
          [mockPreLoadedComponent1, mockPreLoadedComponent2].forEach(
            (element) => {
              callback(element);
            }
          );
        },
      } as any;

      // Mock QueryList for preLoadedWithMultiselectComponents
      const mockPreLoadedWithMultiselectComponent1 = { onClear: jest.fn() };
      const mockPreLoadedWithMultiselectComponent2 = { onClear: jest.fn() };
      (component as any)['preLoadedWithMultiselectComponents'] = {
        forEach: (callback: (component: any) => void) => {
          [
            mockPreLoadedWithMultiselectComponent1,
            mockPreLoadedWithMultiselectComponent2,
          ].forEach((element) => {
            callback(element);
          });
        },
      } as any;

      component['resetFilters']();

      expect(mockPreLoadedComponent1.onClear).toHaveBeenCalled();
      expect(mockPreLoadedComponent2.onClear).toHaveBeenCalled();
      expect(mockPreLoadedWithMultiselectComponent1.onClear).toHaveBeenCalled();
      expect(mockPreLoadedWithMultiselectComponent2.onClear).toHaveBeenCalled();
    });
  });

  describe('isCollapsed behavior', () => {
    it('should toggle isCollapsed when selection changes', () => {
      // Initially set to true
      component.isCollapsed.set(true);

      // Test when isEmpty returns false (has selections)
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(false);

      component.ngOnInit();
      expect(component.isCollapsed()).toBe(true);

      // Test when isEmpty returns true (no selections)
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(true);

      component.ngOnInit();
      expect(component.isCollapsed()).toBe(false);
    });
  });
});
