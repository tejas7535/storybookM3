import * as Utils from '../../../ag-grid/grid-utils';
import { Stub } from '../../../test/stub.class';
import { TableToolbarComponent } from './table-toolbar.component';

describe('TableToolbarComponent', () => {
  let component: TableToolbarComponent;

  beforeEach(() => {
    component = Stub.getForEffect<TableToolbarComponent>({
      component: TableToolbarComponent,
    });

    Stub.setInputs([
      { property: 'rowCount', value: 100 },
      {
        property: 'grid',
        value: Stub.getGridApi(),
      },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.renderFloatingFilter()).toBe(true);
    expect(component.openFloatingFilters()).toBe(false);
    expect(component['showFloatingFilters']).toBe(false);
  });

  describe('effect hook', () => {
    it('should toggle floating filters based on openFloatingFilters input', () => {
      const toggleFilterSpy = jest.spyOn(
        component as any,
        'toggleFloatingFilter'
      );

      expect(component['showFloatingFilters']).toBe(false);

      Stub.setInputs([{ property: 'openFloatingFilters', value: true }]);
      Stub.detectChanges();

      expect(toggleFilterSpy).toHaveBeenCalled();
      expect(component['showFloatingFilters']).toBe(true);
    });
  });

  describe('toggleFloatingFilter', () => {
    it('should toggle showFloatingFilters and call showFloatingFilters utility', () => {
      const spy = jest.spyOn(Utils, 'showFloatingFilters');

      component['showFloatingFilters'] = true;
      component['toggleFloatingFilter']();

      expect(component['showFloatingFilters']).toBe(false);
      expect(spy).toHaveBeenCalledWith(
        component.grid(),
        false,
        component.currentOverlay()
      );
    });

    it('should not call showFloatingFilters if grid is not defined', () => {
      const spy = jest.spyOn(Utils, 'showFloatingFilters');

      // Set grid to undefined
      Stub.setInputs([{ property: 'grid', value: undefined }]);
      Stub.detectChanges();

      component['toggleFloatingFilter']();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onResetFilters', () => {
    it('should call customOnResetFilters function', () => {
      let a = 0;
      Stub.setInputs([
        { property: 'customOnResetFilters', value: () => (a = a + 1) },
      ]);
      Stub.detectChanges();

      component['onResetFilters']();

      expect(a).toBe(1);
    });

    it('should use default reset function if none provided', () => {
      const spy = jest.spyOn(component.grid(), 'setFilterModel');

      component['onResetFilters']();

      expect(spy).toHaveBeenCalledWith({});
    });
  });

  describe('getFilterCount', () => {
    it('should call customGetFilterCount function', () => {
      let a = 0;
      Stub.setInputs([
        { property: 'customGetFilterCount', value: () => (a = a + 1) },
      ]);
      Stub.detectChanges();

      const count = component['getFilterCount']();

      expect(a).toBe(1);
      expect(count).toBe(1);
    });

    it('should use default filter count function if none provided', () => {
      const mockFilterModel = { field1: {}, field2: {} };

      const spy = jest
        .spyOn(component.grid(), 'getFilterModel')
        .mockReturnValue(mockFilterModel);

      const count = component['getFilterCount']();

      expect(spy).toHaveBeenCalled();
      expect(count).toBe(2);
    });

    it('should return 0 if grid is undefined', () => {
      Stub.setInputs([{ property: 'grid', value: undefined }]);
      Stub.detectChanges();

      const count = component['getFilterCount']();

      expect(count).toBe(0);
    });

    it('should return 0 if filter model is undefined', () => {
      jest
        .spyOn(component.grid(), 'getFilterModel')
        .mockReturnValue(undefined as any);

      const count = component['getFilterCount']();

      expect(count).toBe(0);
    });
  });

  describe('getFilterCountText', () => {
    it('should use TranslocoLocaleService to format the filter count', () => {
      const mockTranslate = jest.fn().mockReturnValue('5 filters active');
      jest.mock('@jsverse/transloco', () => ({
        translate: () => mockTranslate,
      }));

      const mockLocaleService = {
        localizeNumber: jest.fn().mockReturnValue('5'),
      };
      (component as any)['translocoLocaleService'] = mockLocaleService as any;

      // Mock getFilterCount to return a fixed value
      jest.spyOn(component as any, 'getFilterCount').mockReturnValue(5);

      component['getFilterCountText']();

      expect(mockLocaleService.localizeNumber).toHaveBeenCalledWith(
        5,
        'decimal'
      );
    });
  });
});
