import { signal } from '@angular/core';

import { of } from 'rxjs';

import { GridApi } from 'ag-grid-enterprise';

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
      // Arrange
      const setColumnDefinitionsSpy = jest.spyOn(
        component as any,
        'setColumnDefinitions'
      );
      const materialCustomerServiceMock = jest.spyOn(
        component['materialCustomerService'],
        'getCriteriaData'
      );

      // Act
      component.ngOnInit();

      // Assert
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
      // Arrange
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(true);

      // Act
      component['getData$']({ startRow: 0, endRow: 10 } as any).subscribe(
        (response) => {
          // Assert
          expect(response).toEqual({ rows: [], rowCount: 0 });
          done();
        }
      );
    });

    it('should call getMaterialCustomerData with correct parameters when global selection is not empty', (done) => {
      // Arrange
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

      // Act
      component['getData$']({ startRow: 0, endRow: 10 } as any).subscribe(
        (response) => {
          // Assert
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
      // Act
      const style = component['getRowStyle']({
        data: { portfolioStatus: 'IA' },
      } as any);

      // Assert
      expect(style).toEqual({ backgroundColor: '#F6F7F9', color: '#646464' });
    });

    it('should return undefined for rows with other portfolioStatus', () => {
      // Act
      const style = component['getRowStyle']({
        data: { portfolioStatus: 'Active' },
      } as any);

      // Assert
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
      // Arrange
      const columnDefs = [
        { colId: 'testCol', headerName: 'Test Column' },
      ] as any;
      const setSpy = jest.spyOn(component['config'], 'set');

      // Act
      component['setConfig'](columnDefs);

      // Assert
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
      // Arrange
      const setConfigSpy = jest.spyOn(component as any, 'setConfig');

      // Act
      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(true);

      // Assert
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
  });
});
