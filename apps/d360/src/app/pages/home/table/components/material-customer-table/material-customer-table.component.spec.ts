import { signal } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';

import { GridApi } from 'ag-grid-enterprise';

import * as Helper from '../../../../../shared/ag-grid/grid-defaults';
import { Stub } from '../../../../../shared/test/stub.class';
import { ExportTableDialogComponent } from '../export-table-dialog/export-table-dialog.component';
import { GlobalSelectionUtils } from './../../../../../feature/global-selection/global-selection.utils';
import { MaterialCustomerTableComponent } from './material-customer-table.component';

describe('MaterialCustomerTableComponent', () => {
  let component: MaterialCustomerTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MaterialCustomerTableComponent>({
      component: MaterialCustomerTableComponent,
      providers: [
        Stub.getMaterialCustomerServiceProvider(),
        Stub.getMaterialCustomerTableServiceProvider(),
        Stub.getMatDialogProvider(),
      ],
    });

    component['gridApi'] = Stub.getGridApi();

    Stub.setInput('selectionFilter', {});

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch criteria data and call setColumnDefinitions', () => {
      const setColumnDefinitionsSpy = jest.spyOn(
        component as any,
        'setColumnDefinitions'
      );
      const materialCustomerServiceMock = jest.spyOn(
        component['materialCustomerService'],
        'getCriteriaData'
      );

      component.ngOnInit();

      expect(materialCustomerServiceMock).toHaveBeenCalled();
      expect(setColumnDefinitionsSpy).toHaveBeenCalled();
      expect((component as any).criteriaData).toEqual({
        filterableFields: [],
        sortableFields: [],
      });
    });
  });

  describe('getData', () => {
    it('should return empty rows when global selection is empty', (done) => {
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(true);

      component['getData$']({ startRow: 0, endRow: 10 } as any).subscribe(
        (response) => {
          expect(response).toEqual({ rows: [], rowCount: 0 });
          done();
        }
      );
    });

    it('should call getMaterialCustomerData with correct parameters when global selection is not empty', (done) => {
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(false);
      const materialCustomerTableServiceMock = jest
        .spyOn(
          component['materialCustomerTableService'],
          'getMaterialCustomerData'
        )
        .mockReturnValue(of({ rows: [{ id: 1 }], rowCount: 1 }));
      const mockFilters = { filterKey: 'filterValue' };
      jest
        .spyOn(GlobalSelectionUtils, 'globalSelectionCriteriaToFilter')
        .mockReturnValue(mockFilters as any);

      component['getData$']({ startRow: 0, endRow: 10 } as any).subscribe(
        (response) => {
          expect(materialCustomerTableServiceMock).toHaveBeenCalledWith(
            mockFilters,
            { startRow: 0, endRow: 10 }
          );
          expect(response).toEqual({ rows: [{ id: 1 }], rowCount: 1 });
          done();
        }
      );
    });
  });

  describe('getRowStyle', () => {
    it('should return gray style for rows with portfolioStatus IA', () => {
      const style = component['getRowStyle']({
        data: { portfolioStatus: 'IA' },
      } as any);

      expect(style).toEqual({ backgroundColor: '#F6F7F9', color: '#646464' });
    });

    it('should return undefined for rows with other portfolioStatus', () => {
      const style = component['getRowStyle']({
        data: { portfolioStatus: 'Active' },
      } as any);

      expect(style).toBeUndefined();
    });
  });

  describe('isExportDisabled', () => {
    it('should return true if globalSelectionStateService is empty', () => {
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(true);

      const result = component['isExportDisabled']();

      expect(result).toBe(true);
    });

    it('should return false if globalSelectionStateService is not empty', () => {
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(false);

      const result = component['isExportDisabled']();

      expect(result).toBe(false);
    });
  });

  describe('openExport', () => {
    let openDialogSpy: jest.SpyInstance;

    beforeEach(() => {
      openDialogSpy = jest.spyOn(component['dialog'], 'open');
      jest
        .spyOn(GlobalSelectionUtils, 'globalSelectionCriteriaToFilter')
        .mockReturnValue('mockFilter' as any);
    });

    it('should open the ExportTableDialogComponent with correct data', () => {
      component['gridApi'] = { test: 'gridApi' } as unknown as GridApi;

      component['openExport']();

      expect(openDialogSpy).toHaveBeenCalledWith(ExportTableDialogComponent, {
        data: {
          gridApi: component['gridApi'],
          filter: 'mockFilter',
          backdrop: false,
        },
      });
    });

    it('should call globalSelectionCriteriaToFilter with the correct selection filter', () => {
      const selectionFilter = { test: 'selectionFilter' } as any;
      (component as any).selectionFilter = signal(selectionFilter);

      component['openExport']();

      expect(
        GlobalSelectionUtils.globalSelectionCriteriaToFilter
      ).toHaveBeenCalledWith(selectionFilter);
    });
  });

  describe('setConfig', () => {
    it('should set the table configuration with the provided column definitions', () => {
      const columnDefs = [
        { colId: 'testCol', headerName: 'Test Column' },
      ] as any;
      const setSpy = jest.spyOn(component['config'], 'set');

      component['setConfig'](columnDefs);

      expect(setSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          table: expect.objectContaining({
            columnDefs: [
              {
                columnDefs,
                layoutId: 0,
                title: 'table.defaultTab',
              },
            ],
            tableId: 'customer-material',
          }),
        })
      );
    });
  });

  describe('setColumnDefinitions', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'setConfig').mockImplementation();
    });

    it('should call setConfig with processed column definitions when loading is complete', () => {
      const setConfigSpy = jest.spyOn(component as any, 'setConfig');

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(true);

      expect(setConfigSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            colId: 'region',
            hide: false,
            lockVisible: false,
          }),
        ])
      );
    });

    it('should subscribe to loading$ and only set config when loading is false', () => {
      component['selectableOptionsService'].loading$ = new BehaviorSubject(
        true
      );
      const setConfigSpy = jest.spyOn(component as any, 'setConfig');
      setConfigSpy.mockClear();

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(true);

      expect(setConfigSpy).not.toHaveBeenCalled();
      setConfigSpy.mockClear();

      // set loading to false
      component['selectableOptionsService'].loading$.next(false);

      expect(setConfigSpy).toHaveBeenCalled();
    });

    it('should apply default column definitions to each column', () => {
      const getDefaultColDefSpy = jest
        .spyOn(Helper, 'getDefaultColDef')
        .mockReturnValue({ defaultProp: 'defaultValue' } as any);

      const setConfigSpy = jest.spyOn(component as any, 'setConfig');

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(false);

      expect(getDefaultColDefSpy).toHaveBeenCalled();
      expect(setConfigSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            defaultProp: 'defaultValue',
          }),
        ])
      );
    });

    it('should set tooltipComponent to TextTooltipComponent for each column', () => {
      const setConfigSpy = jest.spyOn(component as any, 'setConfig');

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(false);

      expect(setConfigSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            tooltipComponent: expect.any(Function),
          }),
        ])
      );
    });

    it('should use translate for column header names', () => {
      const setConfigSpy = jest.spyOn(component as any, 'setConfig');

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(false);

      expect(setConfigSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            headerName: 'material_customer.column.region',
          }),
        ])
      );
    });

    it('should set sortable based on criteriaData.sortableFields', () => {
      component['criteriaData'] = {
        sortableFields: ['region'],
        filterableFields: [],
      };

      const setConfigSpy = jest.spyOn(component as any, 'setConfig');

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(false);

      expect(setConfigSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            colId: 'region',
            sortable: true,
          }),
        ])
      );
    });

    it('should apply filter using getColFilter', () => {
      const getColFilterSpy = jest
        .spyOn(Helper, 'getColFilter')
        .mockReturnValue('customFilter');

      const setConfigSpy = jest.spyOn(component as any, 'setConfig');

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(false);

      expect(getColFilterSpy).toHaveBeenCalled();
      expect(setConfigSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            filter: 'customFilter',
          }),
        ])
      );
    });
  });
});
