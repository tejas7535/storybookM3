import { Stub } from '../../../../shared/test/stub.class';
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
      const snackbarSpy = jest.spyOn(
        component['snackBarService'],
        'openSnackBar'
      );
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
});
