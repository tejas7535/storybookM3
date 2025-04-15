import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { of, throwError } from 'rxjs';

import {
  CellClassParams,
  ColDef,
  EditableCallbackParams,
  FirstDataRenderedEvent,
  GridOptions,
  GridReadyEvent,
  NewColumnsLoadedEvent,
  ValueFormatterParams,
  ValueGetterParams,
  ValueSetterParams,
} from 'ag-grid-enterprise';
import { parseISO, startOfMonth } from 'date-fns';

import {
  KpiBucketTypeEnum,
  KpiData,
  KpiDateRanges,
  KpiEntry,
  KpiType,
  MaterialListEntry,
} from '../../../../feature/demand-validation/model';
import { clientSideTableDefaultProps } from '../../../../shared/ag-grid/grid-defaults';
import { TextWithDotCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/text-with-dot-cell-renderer/text-with-dot-cell-renderer.component';
import {
  DemandValidationUserSettingsKey,
  UserSettingsKey,
} from '../../../../shared/models/user-settings.model';
import {
  demandValidationEditableColor,
  demandValidationInFixZoneColor,
  demandValidationNotEditableColor,
  demandValidationToSmallColor,
  demandValidationWrongInputColor,
} from '../../../../shared/styles/colors';
import { Stub } from '../../../../shared/test/stub.class';
import * as Numbers from '../../../../shared/utils/number';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { PlanningView } from './../../../../feature/demand-validation/planning-view';
import * as CellClass from './cell-style';
import * as Columns from './column-definitions';
import { FilterValues } from './column-definitions';
import { DemandValidationTableComponent } from './demand-validation-table.component';

describe('DemandValidationTableComponent', () => {
  let component: DemandValidationTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<DemandValidationTableComponent>({
      component: DemandValidationTableComponent,
      providers: [
        Stub.getStoreProvider(),
        Stub.getDemandValidationServiceProvider(),
        Stub.getUserServiceProvider(),
      ],
    });

    Stub.setInputs([
      { property: 'materialListEntry', value: null },
      { property: 'planningView', value: null },
      { property: 'kpiDateRange', value: null },
      { property: 'reloadRequired', value: null },
      { property: 'showLoader', value: null },
    ]);
    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('dataLoaded', () => {
    it('should return true when kpiData is not null', () => {
      component['kpiData'].set({} as KpiData);

      expect(component['dataLoaded']()).toBe(true);
    });

    it('should return false when kpiData is null', () => {
      component['kpiData'].set(null);

      expect(component['dataLoaded']()).toBe(false);
    });

    it('should return false when kpiData is an empty object', () => {
      component['kpiData'].set({} as KpiData);

      expect(component['dataLoaded']()).toBe(true);
    });

    it('should return true when kpiData has data', () => {
      component['kpiData'].set({ data: [{}] } as KpiData);

      expect(component['dataLoaded']()).toBe(true);
    });
  });

  describe('gridOptions', () => {
    let gridOptions: GridOptions;

    beforeEach(() => {
      gridOptions = component['gridOptions'];
    });

    it('should have clientSideTableDefaultProps', () => {
      expect(gridOptions).toMatchObject(clientSideTableDefaultProps);
    });

    it('should suppress CSV export', () => {
      expect(gridOptions.suppressCsvExport).toBe(true);
    });

    it('should auto size all columns on first data rendered', () => {
      const event = {
        api: {
          autoSizeAllColumns: jest.fn(),
        },
      } as unknown as FirstDataRenderedEvent;

      gridOptions.onFirstDataRendered(event);

      expect(event.api.autoSizeAllColumns).toHaveBeenCalled();
    });

    it('should auto size all columns on new columns loaded', () => {
      const event = {
        api: {
          autoSizeAllColumns: jest.fn(),
        },
      } as unknown as NewColumnsLoadedEvent;

      gridOptions.onNewColumnsLoaded(event);

      expect(event.api.autoSizeAllColumns).toHaveBeenCalled();
    });

    it('should set gridApi and update column defs and row data on grid ready', () => {
      jest
        .spyOn(component as any, 'updateRowData')
        .mockImplementation(() => {});
      const event = {
        api: {
          setGridOption: jest.fn(),
        },
      } as unknown as GridReadyEvent;

      const updateColumnDefsSpy = jest.spyOn(
        component as any,
        'updateColumnDefs'
      );
      const updateRowDataSpy = jest.spyOn(component as any, 'updateRowData');

      gridOptions.onGridReady(event);

      expect(component['gridApi']).toBe(event.api);
      expect(updateColumnDefsSpy).toHaveBeenCalledWith(component['kpiData']());
      expect(updateRowDataSpy).toHaveBeenCalled();
    });

    it('should have custom tree data auto group column definition', () => {
      const customTreeDataAutoGroupColumnDef = {
        getDataPath: expect.any(Function),
        autoGroupColumnDef: {
          headerName: '',
          valueGetter: expect.any(Function),
          cellRenderer: TextWithDotCellRendererComponent,
          pinned: true,
          width: 300,
          filterParams: {
            buttons: ['reset', 'apply'],
            closeOnApply: true,
            filterOptions: ['equals', 'contains', 'startsWith', 'endsWith'],
            maxNumConditions: 1,
            numberParser: expect.any(Function),
          },
          resizable: true,
          suppressHeaderFilterButton: true,
          suppressHeaderMenuButton: true,
        },
        onCellDoubleClicked: expect.any(Function),
        onCellKeyDown: expect.any(Function),
        treeData: true,
      };

      expect(gridOptions).toMatchObject(customTreeDataAutoGroupColumnDef);
    });

    it('should call valueGetter with correct params', () => {
      const valueGetter: any = gridOptions.autoGroupColumnDef.valueGetter;
      const params = {
        data: {
          title: jest.fn().mockReturnValue('title'),
        },
        node: {
          expanded: true,
        },
      } as unknown as ValueGetterParams;

      const result = valueGetter(params);

      expect(params.data.title).toHaveBeenCalledWith({
        ...component['filterValues'](),
        expanded: params.node.expanded,
      });
      expect(result).toBe('');
    });

    it('should return empty string if data is not present in valueGetter', () => {
      const valueGetter: any = gridOptions.autoGroupColumnDef.valueGetter;
      const params = {
        data: null,
      } as unknown as ValueGetterParams;

      const result = valueGetter(params);

      expect(result).toBe('');
    });
  });

  describe('authorizedToChange', () => {
    it('should return false if backendRoles is null', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue(null);

      expect(component['authorizedToChange']()).toBe(false);
    });

    it('should return false if backendRoles is empty', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue([]);

      expect(component['authorizedToChange']()).toBe(false);
    });

    it('should return false if backendRoles does not include any allowed roles', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue(['user']);

      expect(component['authorizedToChange']()).toBe(false);
    });

    it('should return true if backendRoles includes at least one allowed role', () => {
      jest
        .spyOn(component as any, 'backendRoles')
        .mockReturnValue(['SD-D360_ADMIN']);

      expect(component['authorizedToChange']()).toBe(true);
    });

    it('should return true if backendRoles includes multiple allowed roles', () => {
      jest
        .spyOn(component as any, 'backendRoles')
        .mockReturnValue(['admin', 'SD-D360_ADMIN']);

      expect(component['authorizedToChange']()).toBe(true);
    });

    it('should return false if backendRoles includes roles but none are allowed', () => {
      jest
        .spyOn(component as any, 'backendRoles')
        .mockReturnValue(['guest', 'viewer']);

      expect(component['authorizedToChange']()).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should call setPersistedKPIs', () => {
      const setPersistedKPIsSpy = jest.spyOn(
        component as any,
        'setPersistedKPIs'
      );

      component.ngOnInit();

      expect(setPersistedKPIsSpy).toHaveBeenCalled();
    });
  });

  describe('setPersistedKPIs', () => {
    it('should update filterValues with persisted KPIs from user settings', () => {
      const persistedFilterValues = {
        [KpiType.Deliveries]: false,
        [KpiType.FirmBusiness]: false,
        [KpiType.ForecastProposal]: false,
        [KpiType.ForecastProposalDemandPlanner]: false,
        [KpiType.DemandRelevantSales]: false,
        [KpiType.SalesAmbition]: false,
        [KpiType.Opportunities]: false,
        [KpiType.SalesPlan]: false,
      };
      component['userService'].userSettings.set({
        [UserSettingsKey.DemandValidation]: {
          [DemandValidationUserSettingsKey.Workbench]: persistedFilterValues,
        },
      } as any);
      component['userService'].settingsLoaded$.next(true);

      component['setPersistedKPIs']();

      expect(component['filterValues']()).toEqual({
        ...persistedFilterValues,
        [KpiType.ValidatedForecast]: true,
      });
    });

    it('should retain validated forecast KPI in filterValues', () => {
      const persistedFilterValues = {
        [KpiType.Deliveries]: false,
        [KpiType.FirmBusiness]: false,
        [KpiType.ForecastProposal]: false,
        [KpiType.ForecastProposalDemandPlanner]: false,
        [KpiType.DemandRelevantSales]: false,
        [KpiType.SalesAmbition]: false,
        [KpiType.Opportunities]: false,
        [KpiType.SalesPlan]: false,
      };
      component['userService'].userSettings.set({
        [UserSettingsKey.DemandValidation]: {
          [DemandValidationUserSettingsKey.Workbench]: persistedFilterValues,
        },
      } as any);
      component['userService'].settingsLoaded$.next(true);

      component['setPersistedKPIs']();

      expect(component['filterValues']()[KpiType.ValidatedForecast]).toBe(true);
    });

    it('should handle null persisted filter values gracefully', () => {
      component['userService'].userSettings.set({
        [UserSettingsKey.DemandValidation]: {
          [DemandValidationUserSettingsKey.Workbench]: null,
        },
      } as any);
      component['userService'].settingsLoaded$.next(true);

      component['setPersistedKPIs']();

      expect(component['filterValues']()).toEqual({
        [KpiType.Deliveries]: true,
        [KpiType.FirmBusiness]: true,
        [KpiType.ForecastProposal]: true,
        [KpiType.ForecastProposalDemandPlanner]: true,
        [KpiType.ValidatedForecast]: true,
        [KpiType.DemandRelevantSales]: true,
        [KpiType.SalesAmbition]: true,
        [KpiType.Opportunities]: true,
        [KpiType.SalesPlan]: true,
      });
    });

    it('should handle undefined persisted filter values gracefully', () => {
      component['userService'].userSettings.set({
        [UserSettingsKey.DemandValidation]: {
          [DemandValidationUserSettingsKey.Workbench]: undefined,
        },
      } as any);
      component['userService'].settingsLoaded$.next(true);

      component['setPersistedKPIs']();

      expect(component['filterValues']()).toEqual({
        [KpiType.Deliveries]: true,
        [KpiType.FirmBusiness]: true,
        [KpiType.ForecastProposal]: true,
        [KpiType.ForecastProposalDemandPlanner]: true,
        [KpiType.ValidatedForecast]: true,
        [KpiType.DemandRelevantSales]: true,
        [KpiType.SalesAmbition]: true,
        [KpiType.Opportunities]: true,
        [KpiType.SalesPlan]: true,
      });
    });
  });

  describe('updateRowData', () => {
    it('should update columnDefinitions with the result of getColumnDefinitions', () => {
      const mockColumnDefinitions = [
        { visible: jest.fn().mockReturnValue(true) },
        { visible: jest.fn().mockReturnValue(false) },
      ] as any;
      jest
        .spyOn(Columns, 'getColumnDefinitions')
        .mockReturnValue(mockColumnDefinitions);

      component['updateRowData']();

      expect(component['columnDefinitions']).toEqual(mockColumnDefinitions);
    });

    it('should set rowData on the gridApi with visible rows', () => {
      const mockColumnDefinitions = [
        { visible: jest.fn().mockReturnValue(true) },
        { visible: jest.fn().mockReturnValue(false) },
      ] as any;
      jest
        .spyOn(Columns, 'getColumnDefinitions')
        .mockReturnValue(mockColumnDefinitions);
      component['gridApi'] = Stub.getGridApi();

      component['updateRowData']();

      expect(component['gridApi'].setGridOption).toHaveBeenCalledWith(
        'rowData',
        [mockColumnDefinitions[0]]
      );
    });

    it('should not set rowData on the gridApi if gridApi is undefined', () => {
      const mockColumnDefinitions = [
        { visible: jest.fn().mockReturnValue(true) },
        { visible: jest.fn().mockReturnValue(false) },
      ] as any;
      jest
        .spyOn(Columns, 'getColumnDefinitions')
        .mockReturnValue(mockColumnDefinitions);
      component['gridApi'] = undefined;

      component['updateRowData']();

      expect(component['gridApi']).toBeUndefined();
    });

    it('should filter rows based on filterValues', () => {
      const mockColumnDefinitions = [
        { visible: jest.fn().mockReturnValue(true) },
        { visible: jest.fn().mockReturnValue(false) },
      ] as any;
      jest
        .spyOn(Columns, 'getColumnDefinitions')
        .mockReturnValue(mockColumnDefinitions);
      component['gridApi'] = Stub.getGridApi();

      component['updateRowData']();

      expect(mockColumnDefinitions[0].visible).toHaveBeenCalledWith(
        component['filterValues']()
      );
      expect(mockColumnDefinitions[1].visible).toHaveBeenCalledWith(
        component['filterValues']()
      );
    });
  });

  describe('isValueNoNumberOrTooSmall', () => {
    beforeEach(() => {
      jest
        .spyOn(ValidationHelper, 'getDecimalSeparatorForActiveLocale')
        .mockReturnValue('PERIOD');
    });

    it('should return true if the value is a negative number', () => {
      const result = component['isValueNoNumberOrTooSmall'](-1);

      expect(result).toBe(true);
    });

    it('should return false if the value is a positive number', () => {
      const result = component['isValueNoNumberOrTooSmall'](1);

      expect(result).toBe(false);
    });

    it('should return true if the value is NaN and not null or empty string', () => {
      const result = component['isValueNoNumberOrTooSmall']('NaN');

      expect(result).toBe(true);
    });

    it('should return false if the value is NaN and is null', () => {
      const result = component['isValueNoNumberOrTooSmall'](null);

      expect(result).toBe(false);
    });

    it('should return false if the value is NaN and is an empty string', () => {
      const result = component['isValueNoNumberOrTooSmall']('');

      expect(result).toBe(false);
    });

    it('should return false if the value is zero', () => {
      const result = component['isValueNoNumberOrTooSmall'](0);

      expect(result).toBe(false);
    });

    it('should return true if the value is a negative float', () => {
      const result = component['isValueNoNumberOrTooSmall'](-0.5);

      expect(result).toBe(true);
    });

    it('should return false if the value is a positive float', () => {
      const result = component['isValueNoNumberOrTooSmall'](0.5);

      expect(result).toBe(false);
    });

    it('should return true if the value is a string representing a negative number', () => {
      const result = component['isValueNoNumberOrTooSmall']('-1');

      expect(result).toBe(true);
    });

    it('should return false if the value is a string representing a positive number', () => {
      const result = component['isValueNoNumberOrTooSmall']('1');

      expect(result).toBe(false);
    });

    it('should return true if the value is a string representing a negative float', () => {
      const result = component['isValueNoNumberOrTooSmall']('-0.5');

      expect(result).toBe(true);
    });

    it('should return false if the value is a string representing a positive float', () => {
      const result = component['isValueNoNumberOrTooSmall']('0.5');

      expect(result).toBe(false);
    });
  });

  describe('isSmallerFirmBusinessAndDeliveries', () => {
    beforeEach(() => {
      jest
        .spyOn(ValidationHelper, 'getDecimalSeparatorForActiveLocale')
        .mockReturnValue('PERIOD');
    });

    it('should return true if the parsed value is smaller than the sum of firm business and deliveries', () => {
      const value = '5';
      const data = {
        deliveriesActive: 3,
        firmBusinessActive: 3,
      } as KpiEntry;
      jest
        .spyOn(component as any, 'calculateFirmBusinessAndDeliveries')
        .mockReturnValue(6);

      const result = component['isSmallerFirmBusinessAndDeliveries'](
        value,
        data
      );

      expect(result).toBe(true);
    });

    it('should return false if the parsed value is equal to the sum of firm business and deliveries', () => {
      const value = '6';
      const data = {
        deliveriesActive: 3,
        firmBusinessActive: 3,
      } as KpiEntry;
      jest
        .spyOn(component as any, 'calculateFirmBusinessAndDeliveries')
        .mockReturnValue(6);

      const result = component['isSmallerFirmBusinessAndDeliveries'](
        value,
        data
      );

      expect(result).toBe(false);
    });

    it('should return false if the parsed value is greater than the sum of firm business and deliveries', () => {
      const value = '7';
      const data = {
        deliveriesActive: 3,
        firmBusinessActive: 3,
      } as KpiEntry;
      jest
        .spyOn(component as any, 'calculateFirmBusinessAndDeliveries')
        .mockReturnValue(6);

      const result = component['isSmallerFirmBusinessAndDeliveries'](
        value,
        data
      );

      expect(result).toBe(false);
    });

    it('should return false if the parsed value is NaN and the sum of firm business and deliveries is 0', () => {
      const value = 'NaN';
      const data = {
        deliveriesActive: 0,
        firmBusinessActive: 0,
      } as KpiEntry;
      jest
        .spyOn(component as any, 'calculateFirmBusinessAndDeliveries')
        .mockReturnValue(0);

      const result = component['isSmallerFirmBusinessAndDeliveries'](
        value,
        data
      );

      expect(result).toBe(false);
    });

    it('should return true if the parsed value is smaller than the sum of firm business and deliveries when value is a number', () => {
      const value = 5;
      const data = {
        deliveriesActive: 3,
        firmBusinessActive: 3,
      } as KpiEntry;
      jest
        .spyOn(component as any, 'calculateFirmBusinessAndDeliveries')
        .mockReturnValue(6);

      const result = component['isSmallerFirmBusinessAndDeliveries'](
        value,
        data
      );

      expect(result).toBe(true);
    });

    it('should return false if the parsed value is equal to the sum of firm business and deliveries when value is a number', () => {
      const value = 6;
      const data = {
        deliveriesActive: 3,
        firmBusinessActive: 3,
      } as KpiEntry;
      jest
        .spyOn(component as any, 'calculateFirmBusinessAndDeliveries')
        .mockReturnValue(6);

      const result = component['isSmallerFirmBusinessAndDeliveries'](
        value,
        data
      );

      expect(result).toBe(false);
    });

    it('should return false if the parsed value is greater than the sum of firm business and deliveries when value is a number', () => {
      const value = 7;
      const data = {
        deliveriesActive: 3,
        firmBusinessActive: 3,
      } as KpiEntry;
      jest
        .spyOn(component as any, 'calculateFirmBusinessAndDeliveries')
        .mockReturnValue(6);

      const result = component['isSmallerFirmBusinessAndDeliveries'](
        value,
        data
      );

      expect(result).toBe(false);
    });
  });

  describe('updateColumnDefs', () => {
    let kpiData: KpiData;

    beforeEach(() => {
      kpiData = {
        data: [
          {
            fromDate: '2023-01-01',
            deliveriesActive: 10,
            firmBusinessActive: 5,
            bucketType: 'MONTH',
            storedBucketType: 'MONTH',
          },
          {
            fromDate: '2023-02-01',
            deliveriesActive: 15,
            firmBusinessActive: 10,
            bucketType: 'MONTH',
            storedBucketType: 'MONTH',
          },
        ],
      } as KpiData;

      jest
        .spyOn(ValidationHelper, 'getDecimalSeparatorForActiveLocale')
        .mockReturnValue('PERIOD');
    });

    it('should set columnDefs on the gridApi with the correct column definitions', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      component['updateColumnDefs'](kpiData);

      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'columnDefs',
        expect.any(Array)
      );
    });

    it('should create column definitions based on kpiData', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      component['updateColumnDefs'](kpiData);

      const columnDefs = setGridOptionSpy.mock.calls[0][1];
      expect(columnDefs.length).toBe(2);
      expect(columnDefs[0].colId).toBe('2023-01-01');
      expect(columnDefs[1].colId).toBe('2023-02-01');
    });

    it('should set editable property based on the editable function', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      const editableSpy = jest.spyOn(component as any, 'editable');

      component['updateColumnDefs'](kpiData);

      const columnDefs = setGridOptionSpy.mock.calls[0][1];
      columnDefs.forEach((colDef: ColDef, index: number) => {
        expect(editableSpy).toHaveBeenCalledWith(kpiData.data[index]);
        expect(colDef.editable).toBeInstanceOf(Function);
      });
    });

    it('should set valueGetter property based on the getKey function', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      component['updateColumnDefs'](kpiData);

      const columnDefs = setGridOptionSpy.mock.calls[0][1];
      columnDefs.forEach((colDef: ColDef) => {
        expect(colDef.valueGetter).toBeInstanceOf(Function);
      });
    });

    it('should set valueFormatter property based on the parseAndFormatNumber function', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      const parseAndFormatNumberSpy = jest.spyOn(
        component as any,
        'parseAndFormatNumber'
      );

      component['updateColumnDefs'](kpiData);

      const columnDefs = setGridOptionSpy.mock.calls[0][1];
      columnDefs.forEach((colDef: ColDef) => {
        expect(colDef.valueFormatter).toBeInstanceOf(Function);
        const params = {} as ValueFormatterParams;
        (colDef as any).valueFormatter(params);
        expect(parseAndFormatNumberSpy).toHaveBeenCalledWith(params);
      });
    });

    it('should set valueSetter property based on the validatedForecastSetter function', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      const validatedForecastSetterSpy = jest.spyOn(
        component as any,
        'validatedForecastSetter'
      );

      component['updateColumnDefs'](kpiData);

      const columnDefs = setGridOptionSpy.mock.calls[0][1];
      columnDefs.forEach((colDef: ColDef, index: number) => {
        expect(validatedForecastSetterSpy).toHaveBeenCalledWith(
          kpiData.data[index]
        );
        expect(colDef.valueSetter).toBeInstanceOf(Function);
      });
    });

    it('should set cellClass property based on the getCellClass function', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      const getCellClassSpy = jest
        .spyOn(CellClass, 'getCellClass')
        .mockImplementation(() => () => '');

      component['updateColumnDefs'](kpiData);

      const columnDefs = setGridOptionSpy.mock.calls[0][1];
      columnDefs.forEach((colDef: ColDef, index: number) => {
        (colDef as any).cellClass();

        expect(getCellClassSpy).toHaveBeenCalledWith(
          kpiData.data[index].bucketType,
          component['materialListEntry']()?.dateRltDl,
          component['materialListEntry']()?.dateFrozenZoneDl
        );
        expect(colDef.cellClass).toBeInstanceOf(Function);
      });
    });

    it('should set cellStyle property based on the colorCell function', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      const colorCellSpy = jest
        .spyOn(component as any, 'colorCell')
        .mockImplementation(() => () => {});

      component['updateColumnDefs'](kpiData);

      const columnDefs = setGridOptionSpy.mock.calls[0][1];
      columnDefs.forEach((colDef: ColDef, index: number) => {
        (colDef as any).cellStyle();
        expect(colorCellSpy).toHaveBeenCalledWith(kpiData.data[index]);
        expect(colDef.cellStyle).toBeInstanceOf(Function);
      });
    });

    it('should set tooltipValueGetter property based on the isValueNoNumberOrTooSmall functions', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      const isValueNoNumberOrTooSmallSpy = jest.spyOn(
        component as any,
        'isValueNoNumberOrTooSmall'
      );

      component['updateColumnDefs'](kpiData);

      const columnDefs = setGridOptionSpy.mock.calls[0][1];

      columnDefs.forEach((colDef: ColDef) => {
        expect(colDef.tooltipValueGetter).toBeInstanceOf(Function);
        const params = {
          value: 'testValue',
          data: {
            key: () => KpiType.ValidatedForecast,
          },
          node: { expanded: true },
        } as any;
        colDef.tooltipValueGetter(params);
        expect(isValueNoNumberOrTooSmallSpy).toHaveBeenCalledWith(params.value);
      });
    });

    it('should set tooltipValueGetter property based on the isValueNoNumberOrTooSmall and isSmallerFirmBusinessAndDeliveries functions', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      const isValueNoNumberOrTooSmallSpy = jest
        .spyOn(component as any, 'isValueNoNumberOrTooSmall')
        .mockReturnValue(false);
      const isSmallerFirmBusinessAndDeliveriesSpy = jest.spyOn(
        component as any,
        'isSmallerFirmBusinessAndDeliveries'
      );

      component['updateColumnDefs'](kpiData);

      const columnDefs = setGridOptionSpy.mock.calls[0][1];

      columnDefs.forEach((colDef: ColDef) => {
        expect(colDef.tooltipValueGetter).toBeInstanceOf(Function);
        const params = {
          value: 'testValue',
          data: {
            key: () => KpiType.ValidatedForecast,
          },
          node: { expanded: true },
        } as any;
        colDef.tooltipValueGetter(params);
        expect(isValueNoNumberOrTooSmallSpy).toHaveBeenCalledWith(params.value);
        expect(isSmallerFirmBusinessAndDeliveriesSpy).toHaveBeenCalledWith(
          params.value,
          expect.any(Object)
        );
      });
    });

    it('should set headerComponentParams property with kpiEntry and onClickHeader', () => {
      component['gridApi'] = Stub.getGridApi();
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      component['updateColumnDefs'](kpiData);

      const columnDefs = setGridOptionSpy.mock.calls[0][1];
      columnDefs.forEach((colDef: ColDef, index: number) => {
        expect(colDef.headerComponentParams).toEqual({
          kpiEntry: kpiData.data[index],
          onClickHeader: expect.any(Function),
        });
      });
    });
  });

  describe('parseAndFormatNumber', () => {
    it('should call parseAndFormatNumber', () => {
      const parseAndFormatNumberSpy = jest
        .spyOn(Numbers, 'parseAndFormatNumber')
        .mockImplementation(() => '');

      component['parseAndFormatNumber']({ foo: 'bar' } as any);

      expect(parseAndFormatNumberSpy).toHaveBeenCalledWith(
        { foo: 'bar' } as any,
        expect.anything()
      );
    });
  });

  describe('onSlideToggleChange', () => {
    let event: MatSlideToggleChange;
    let key: keyof FilterValues;

    beforeEach(() => {
      event = { checked: true } as MatSlideToggleChange;
      key = KpiType.Deliveries;
    });

    it('should update filterValues with the new toggle state', () => {
      const updateSpy = jest.spyOn(component['filterValues'], 'update');

      component['onSlideToggleChange'](event, key);

      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      const updateFunction = updateSpy.mock.calls[0][0];
      const currentFilterValues = component['filterValues']();
      const newFilterValues = updateFunction(currentFilterValues);
      expect(newFilterValues[key]).toBe(event.checked);
    });

    it('should delete ValidatedForecast from newSettings', () => {
      component['filterValues'].set({
        [KpiType.Deliveries]: true,
        [KpiType.ValidatedForecast]: true,
      } as any);

      component['onSlideToggleChange'](event, key);

      const newSettings = component['filterValues']();
      expect(newSettings[KpiType.ValidatedForecast]).toBeUndefined();
    });

    it('should call updateUserSettings with the correct parameters', () => {
      const updateUserSettingsSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );

      component['onSlideToggleChange'](event, key);

      expect(updateUserSettingsSpy).toHaveBeenCalledWith(
        DemandValidationUserSettingsKey.Workbench,
        expect.any(Object)
      );
    });

    it('should merge newSettings with existing user settings', () => {
      const existingSettings = {
        [DemandValidationUserSettingsKey.Workbench]: {
          [KpiType.Deliveries]: {
            deliveries: true,
            demandRelevantSales: true,
            firmBusiness: true,
            forecastProposal: true,
            forecastProposalDemandPlanner: true,
            opportunities: true,
            salesAmbition: true,
            salesPlan: true,
          },
        },
      };
      component['userService'].userSettings.set({
        [UserSettingsKey.DemandValidation]: existingSettings,
      } as any);

      component['onSlideToggleChange'](event, key);

      const newSettings = component['filterValues']();
      expect(newSettings[KpiType.Deliveries]).toBe(event.checked);
      expect(newSettings[KpiType.ValidatedForecast]).toBeUndefined();
    });

    it('should handle undefined user settings gracefully', () => {
      component['userService'].userSettings.set(undefined);

      component['onSlideToggleChange'](event, key);

      const newSettings = component['filterValues']();
      expect(newSettings[KpiType.Deliveries]).toBe(event.checked);
      expect(newSettings[KpiType.ValidatedForecast]).toBeUndefined();
    });

    it('should handle null user settings gracefully', () => {
      component['userService'].userSettings.set(null);

      component['onSlideToggleChange'](event, key);

      const newSettings = component['filterValues']();
      expect(newSettings[KpiType.Deliveries]).toBe(event.checked);
      expect(newSettings[KpiType.ValidatedForecast]).toBeUndefined();
    });
  });

  describe('loadKPIs', () => {
    let materialListEntry: MaterialListEntry;
    let kpiDateRange: KpiDateRanges;
    let dateExceptions: Date[];

    beforeEach(() => {
      materialListEntry = {
        materialNumber: '123',
        customerNumber: '456',
        dateBeginMaintPossibleMonth: '2023-01-01',
        dateEndMaintPossibleMonth: '2023-12-31',
        dateBeginMaintPossibleWeek: '2023-01-01',
        dateEndMaintPossibleWeek: '2023-12-31',
        fixHor: '2023-06-01',
        stochasticType: 'E',
      } as MaterialListEntry;
      kpiDateRange = {
        fromDate: '2023-01-01',
        toDate: '2023-12-31',
      } as any;
      dateExceptions = [new Date('2023-02-01')];
    });

    it('should reset changedData, valuesChanged, kpiData, and kpiError', () => {
      component['changedData'].set({ key: 'value' } as any);
      component['kpiData'].set({} as KpiData);
      component['kpiError'].set('error');

      component['loadKPIs'](undefined, kpiDateRange, dateExceptions);

      expect(component['changedData']()).toEqual({});
      expect(component['kpiData']()).toBeNull();
      expect(component['kpiError']()).toBe('hint.noData');
    });

    it('should set loading to true when materialListEntry, kpiDateRange, and dateExceptions are provided', () => {
      const setLoadingSpy = jest.spyOn(component['loading'], 'set');

      component['loadKPIs'](materialListEntry, kpiDateRange, dateExceptions);

      expect(setLoadingSpy).toHaveBeenCalledWith(true);
    });

    it('should call demandValidationService.getKpiData with correct parameters', () => {
      const getKpiDataSpy = jest
        .spyOn(component['demandValidationService'], 'getKpiData')
        .mockReturnValue(of({} as KpiData));

      component['loadKPIs'](materialListEntry, kpiDateRange, dateExceptions);

      expect(getKpiDataSpy).toHaveBeenCalledWith(
        materialListEntry,
        kpiDateRange,
        dateExceptions
      );
    });

    it('should set kpiData with the returned data if data is available', () => {
      const kpiData = { data: [{}] } as KpiData;
      jest
        .spyOn(component['demandValidationService'], 'getKpiData')
        .mockReturnValue(of(kpiData));
      const setKpiDataSpy = jest.spyOn(component['kpiData'], 'set');

      component['loadKPIs'](materialListEntry, kpiDateRange, dateExceptions);

      expect(setKpiDataSpy).toHaveBeenCalledWith(kpiData);
    });

    it('should set kpiError to "hint.noData" if no data is returned', () => {
      jest
        .spyOn(component['demandValidationService'], 'getKpiData')
        .mockReturnValue(of(null));
      const setKpiErrorSpy = jest.spyOn(component['kpiError'], 'set');

      component['loadKPIs'](materialListEntry, kpiDateRange, dateExceptions);

      expect(setKpiErrorSpy).toHaveBeenCalledWith('hint.noData');
    });

    it('should set kpiError to "error.loading_failed" on error', () => {
      jest
        .spyOn(component['demandValidationService'], 'getKpiData')
        .mockReturnValue(throwError(() => new Error('error')));
      const setKpiErrorSpy = jest.spyOn(component['kpiError'], 'set');

      component['loadKPIs'](materialListEntry, kpiDateRange, dateExceptions);

      expect(setKpiErrorSpy).toHaveBeenCalledWith('error.loading_failed');
    });

    it('should set loading to false after data is loaded', () => {
      jest
        .spyOn(component['demandValidationService'], 'getKpiData')
        .mockReturnValue(of({} as KpiData));
      const setLoadingSpy = jest.spyOn(component['loading'], 'set');

      component['loadKPIs'](materialListEntry, kpiDateRange, dateExceptions);

      expect(setLoadingSpy).toHaveBeenCalledWith(false);
    });

    it('should set kpiError to "hint.noData" if materialListEntry, kpiDateRange, or dateExceptions are not provided', () => {
      const setKpiErrorSpy = jest.spyOn(component['kpiError'], 'set');

      component['loadKPIs'](undefined, kpiDateRange, dateExceptions);

      expect(setKpiErrorSpy).toHaveBeenCalledWith('hint.noData');
    });
  });

  describe('isEditable', () => {
    let params: EditableCallbackParams;
    let data: KpiEntry;

    beforeEach(() => {
      params = {
        data: {
          editable: true,
        },
      } as EditableCallbackParams;
      data = {
        fromDate: '2023-01-01',
        bucketType: 'MONTH',
      } as KpiEntry;
    });

    it('should return false if not authorized to change', () => {
      jest.spyOn(component as any, 'authorizedToChange').mockReturnValue(false);

      const result = component['isEditable'](params, data);

      expect(result).toBe(false);
    });

    it('should return false if considerColumnDefinitionEditable is true and column is not editable', () => {
      jest.spyOn(component as any, 'authorizedToChange').mockReturnValue(true);
      params.data.editable = false;

      const result = component['isEditable'](params, data);

      expect(result).toBe(false);
    });

    it('should return false if fromDateCurrentColumn is after lastEditableDateFromSAP', () => {
      jest.spyOn(component as any, 'authorizedToChange').mockReturnValue(true);
      data.fromDate = '9999-12-31';
      data.bucketType = KpiBucketTypeEnum.MONTH;
      jest.spyOn(component as any, 'materialListEntry').mockReturnValue({
        dateEndMaintPossibleMonth: '1900-02-01',
      });

      const result = component['isEditable'](params, data);

      expect(result).toBe(false);
    });

    it('should return false if firstEditableDateFromSAP is after fromDateCurrentColumn', () => {
      jest.spyOn(component as any, 'authorizedToChange').mockReturnValue(true);
      data.fromDate = '2023-01-01';
      jest.spyOn(component as any, 'materialListEntry').mockReturnValue({
        dateBeginMaintPossibleMonth: '2023-02-01',
      });

      const result = component['isEditable'](params, data);

      expect(result).toBe(false);
    });

    it('should return true if fromDateCurrentColumn is within editable range', () => {
      jest.spyOn(component as any, 'authorizedToChange').mockReturnValue(true);
      data.fromDate = '2023-01-01';
      jest.spyOn(component as any, 'materialListEntry').mockReturnValue({
        dateBeginMaintPossibleMonth: '2023-01-01',
        dateEndMaintPossibleMonth: '2023-12-31',
      });

      const result = component['isEditable'](params, data);

      expect(result).toBe(true);
    });

    it('should handle WEEK bucket type correctly', () => {
      jest.spyOn(component as any, 'authorizedToChange').mockReturnValue(true);
      data.bucketType = KpiBucketTypeEnum.WEEK;
      data.fromDate = '2023-01-01';
      jest.spyOn(component as any, 'materialListEntry').mockReturnValue({
        dateBeginMaintPossibleWeek: '2023-01-01',
        dateEndMaintPossibleWeek: '2023-12-31',
      });

      const result = component['isEditable'](params, data);

      expect(result).toBe(true);
    });

    it('should handle invalid dateEndMaintPossibleMonth correctly', () => {
      jest.spyOn(component as any, 'authorizedToChange').mockReturnValue(true);
      data.fromDate = '2023-01-01';
      jest.spyOn(component as any, 'materialListEntry').mockReturnValue({
        dateBeginMaintPossibleMonth: '2023-01-01',
        dateEndMaintPossibleMonth: '1900-01-01',
      });

      const result = component['isEditable'](params, data);

      expect(result).toBe(true);
    });

    it('should handle invalid dateEndMaintPossibleWeek correctly', () => {
      jest.spyOn(component as any, 'authorizedToChange').mockReturnValue(true);
      data.bucketType = KpiBucketTypeEnum.WEEK;
      data.fromDate = '2023-01-01';
      jest.spyOn(component as any, 'materialListEntry').mockReturnValue({
        dateBeginMaintPossibleWeek: '2023-01-01',
        dateEndMaintPossibleWeek: '1900-01-01',
      });

      const result = component['isEditable'](params, data);

      expect(result).toBe(true);
    });
  });

  describe('editable', () => {
    let data: KpiEntry;
    let params: EditableCallbackParams;

    beforeEach(() => {
      data = {
        fromDate: '2023-01-01',
        bucketType: 'MONTH',
      } as KpiEntry;
      params = {
        data: {
          editable: true,
        },
      } as EditableCallbackParams;
    });

    it('should return a function', () => {
      const result = component['editable'](data);
      expect(typeof result).toBe('function');
    });

    it('should call isEditable with correct parameters', () => {
      const isEditableSpy = jest.spyOn(component as any, 'isEditable');
      const editableFn = component['editable'](data);

      editableFn(params);

      expect(isEditableSpy).toHaveBeenCalledWith(params, data);
    });

    it('should return true if isEditable returns true', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);
      const editableFn = component['editable'](data);

      const result = editableFn(params);

      expect(result).toBe(true);
    });

    it('should return false if isEditable returns false', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(false);
      const editableFn = component['editable'](data);

      const result = editableFn(params);

      expect(result).toBe(false);
    });

    it('should handle different bucket types correctly', () => {
      data.bucketType = KpiBucketTypeEnum.WEEK;
      const isEditableSpy = jest.spyOn(component as any, 'isEditable');
      const editableFn = component['editable'](data);

      editableFn(params);

      expect(isEditableSpy).toHaveBeenCalledWith(params, data);
    });

    it('should handle different fromDate values correctly', () => {
      data.fromDate = '2023-02-01';
      const isEditableSpy = jest.spyOn(component as any, 'isEditable');
      const editableFn = component['editable'](data);

      editableFn(params);

      expect(isEditableSpy).toHaveBeenCalledWith(params, data);
    });

    it('should handle different editable states correctly', () => {
      params.data.editable = false;
      const isEditableSpy = jest.spyOn(component as any, 'isEditable');
      const editableFn = component['editable'](data);

      editableFn(params);

      expect(isEditableSpy).toHaveBeenCalledWith(params, data);
    });
  });

  describe('calculateFirmBusinessAndDeliveries', () => {
    it('should return the sum of deliveriesActive and firmBusinessActive', () => {
      const data = {
        deliveriesActive: 5,
        firmBusinessActive: 10,
      } as KpiEntry;

      const result = component['calculateFirmBusinessAndDeliveries'](data);

      expect(result).toBe(15);
    });

    it('should return the sum when deliveriesActive is 0', () => {
      const data = {
        deliveriesActive: 0,
        firmBusinessActive: 10,
      } as KpiEntry;

      const result = component['calculateFirmBusinessAndDeliveries'](data);

      expect(result).toBe(10);
    });

    it('should return the sum when firmBusinessActive is 0', () => {
      const data = {
        deliveriesActive: 5,
        firmBusinessActive: 0,
      } as KpiEntry;

      const result = component['calculateFirmBusinessAndDeliveries'](data);

      expect(result).toBe(5);
    });

    it('should return 0 when both deliveriesActive and firmBusinessActive are 0', () => {
      const data = {
        deliveriesActive: 0,
        firmBusinessActive: 0,
      } as KpiEntry;

      const result = component['calculateFirmBusinessAndDeliveries'](data);

      expect(result).toBe(0);
    });

    it('should return the sum when deliveriesActive is undefined', () => {
      const data = {
        deliveriesActive: undefined,
        firmBusinessActive: 10,
      } as KpiEntry;

      const result = component['calculateFirmBusinessAndDeliveries'](data);

      expect(result).toBe(10);
    });

    it('should return the sum when firmBusinessActive is undefined', () => {
      const data = {
        deliveriesActive: 5,
        firmBusinessActive: undefined,
      } as KpiEntry;

      const result = component['calculateFirmBusinessAndDeliveries'](data);

      expect(result).toBe(5);
    });

    it('should return 0 when both deliveriesActive and firmBusinessActive are undefined', () => {
      const data = {
        deliveriesActive: undefined,
        firmBusinessActive: undefined,
      } as KpiEntry;

      const result = component['calculateFirmBusinessAndDeliveries'](data);

      expect(result).toBe(0);
    });

    it('should return the sum when deliveriesActive is null', () => {
      const data = {
        deliveriesActive: null,
        firmBusinessActive: 10,
      } as KpiEntry;

      const result = component['calculateFirmBusinessAndDeliveries'](data);

      expect(result).toBe(10);
    });

    it('should return the sum when firmBusinessActive is null', () => {
      const data = {
        deliveriesActive: 5,
        firmBusinessActive: null,
      } as KpiEntry;

      const result = component['calculateFirmBusinessAndDeliveries'](data);

      expect(result).toBe(5);
    });

    it('should return 0 when both deliveriesActive and firmBusinessActive are null', () => {
      const data = {
        deliveriesActive: null,
        firmBusinessActive: null,
      } as KpiEntry;

      const result = component['calculateFirmBusinessAndDeliveries'](data);

      expect(result).toBe(0);
    });
  });

  describe('colorCell', () => {
    let data: KpiEntry;
    let params: CellClassParams;

    beforeEach(() => {
      jest
        .spyOn(ValidationHelper, 'getDecimalSeparatorForActiveLocale')
        .mockReturnValue('PERIOD');

      data = {
        fromDate: '2023-01-01',
        bucketType: KpiBucketTypeEnum.MONTH,
      } as KpiEntry;
      params = {
        data: {
          key: jest.fn().mockReturnValue(KpiType.DemandRelevantSales),
          editable: true,
        },
        node: {
          expanded: true,
        },
        value: 10,
      } as unknown as CellClassParams;
    });

    it('should return demandValidationNotEditableColor if cell is not editable', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(false);

      const colorCellFn = component['colorCell'](data);
      const result = colorCellFn(params);

      expect(result).toEqual({
        backgroundColor: demandValidationNotEditableColor,
      });
    });

    it('should return demandValidationInFixZoneColor if cell is in fix zone and key is demandRelevantSales', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);
      jest.spyOn(component as any, 'materialListEntry').mockReturnValue({
        fixHor: '2023-06-01',
        stochasticType: 'E',
      });

      jest.useFakeTimers();
      jest.setSystemTime(new Date('2022-12-24'));

      const colorCellFn = component['colorCell'](data);
      const result = colorCellFn(params);

      expect(result).toEqual({
        backgroundColor: demandValidationInFixZoneColor,
      });
    });

    it('should return demandValidationWrongInputColor if value is no number or too small', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);
      jest
        .spyOn(component as any, 'isValueNoNumberOrTooSmall')
        .mockReturnValue(true);

      const colorCellFn = component['colorCell'](data);
      const result = colorCellFn(params);

      expect(result).toEqual({
        backgroundColor: demandValidationWrongInputColor,
      });
    });

    it('should return demandValidationToSmallColor if value is smaller than firm business and deliveries', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);
      jest
        .spyOn(component as any, 'isValueNoNumberOrTooSmall')
        .mockReturnValue(false);
      jest
        .spyOn(component as any, 'isSmallerFirmBusinessAndDeliveries')
        .mockReturnValue(true);

      const colorCellFn = component['colorCell'](data);
      const result = colorCellFn(params);

      expect(result).toEqual({ backgroundColor: demandValidationToSmallColor });
    });

    it('should return demandValidationEditableColor if cell is editable', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);
      jest
        .spyOn(component as any, 'isValueNoNumberOrTooSmall')
        .mockReturnValue(false);
      jest
        .spyOn(component as any, 'isSmallerFirmBusinessAndDeliveries')
        .mockReturnValue(false);

      const colorCellFn = component['colorCell'](data);
      const result = colorCellFn(params);

      expect(result).toEqual({
        backgroundColor: demandValidationEditableColor,
      });
    });

    it('should return null if no special styling is required', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);
      jest
        .spyOn(component as any, 'isValueNoNumberOrTooSmall')
        .mockReturnValue(false);
      jest
        .spyOn(component as any, 'isSmallerFirmBusinessAndDeliveries')
        .mockReturnValue(false);
      params.data.editable = false;

      const colorCellFn = component['colorCell'](data);
      const result = colorCellFn(params);

      expect(result).toBeNull();
    });

    it('should handle WEEK bucket type correctly', () => {
      data.bucketType = KpiBucketTypeEnum.WEEK;
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);
      jest.spyOn(component as any, 'materialListEntry').mockReturnValue({
        fixHor: '2023-06-01',
        stochasticType: 'E',
      });

      jest.useFakeTimers();
      jest.setSystemTime(new Date('2022-12-24'));

      const colorCellFn = component['colorCell'](data);
      const result = colorCellFn(params);

      expect(result).toEqual({
        backgroundColor: demandValidationInFixZoneColor,
      });
    });

    it('should handle invalid fixHor correctly', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);
      jest.spyOn(component as any, 'materialListEntry').mockReturnValue({
        fixHor: 'invalid-date',
        stochasticType: 'E',
      });

      const colorCellFn = component['colorCell'](data);
      const result = colorCellFn({
        data: {
          key: jest.fn().mockReturnValue(KpiType.DemandRelevantSales),
          editable: false,
        },
        node: {
          expanded: true,
        },
        value: 10,
      } as any);

      expect(result).toBeNull();
    });

    it('should handle invalid stochasticType correctly', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);
      jest.spyOn(component as any, 'materialListEntry').mockReturnValue({
        fixHor: '2023-06-01',
        stochasticType: 'invalid-type',
      });

      const colorCellFn = component['colorCell'](data);
      const result = colorCellFn({
        data: {
          key: jest.fn().mockReturnValue(KpiType.DemandRelevantSales),
          editable: false,
        },
        node: {
          expanded: true,
        },
        value: 10,
      } as any);

      expect(result).toBeNull();
    });
  });

  describe('validatedForecastSetter', () => {
    let data: KpiEntry;
    let params: ValueSetterParams;

    beforeEach(() => {
      data = {
        fromDate: '2023-01-01',
        bucketType: KpiBucketTypeEnum.MONTH,
        storedBucketType: KpiBucketTypeEnum.MONTH,
      } as KpiEntry;
      params = {
        oldValue: '10',
        newValue: '20',
        data: {
          key: jest.fn().mockReturnValue('validatedForecast'),
        },
        column: {
          getColId: jest.fn().mockReturnValue('2023-01-01'),
        },
        node: {
          expanded: true,
        },
      } as unknown as ValueSetterParams;
    });

    it('should return false if oldValue is equal to newValue and newValue is not empty', () => {
      params.oldValue = '20';
      params.newValue = '20';

      const validatedForecastSetterFn =
        component['validatedForecastSetter'](data);
      const result = validatedForecastSetterFn(params);

      expect(result).toBe(false);
    });

    it('should return false if cell is not editable', () => {
      jest.spyOn(component as any, 'isEditable').mockReturnValue(false);

      const validatedForecastSetterFn =
        component['validatedForecastSetter'](data);
      const result = validatedForecastSetterFn(params);

      expect(result).toBe(false);
    });

    it('should show confirm dialog if storedBucketType is WEEK and bucketType is MONTH', () => {
      data.storedBucketType = KpiBucketTypeEnum.WEEK;
      data.bucketType = KpiBucketTypeEnum.MONTH;
      jest.spyOn(global, 'confirm').mockReturnValue(true);
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);
      jest.spyOn(component as any, 'updateData').mockImplementation(() => {});

      const validatedForecastSetterFn =
        component['validatedForecastSetter'](data);
      validatedForecastSetterFn(params);

      expect(global.confirm).toHaveBeenCalledWith(
        'validation_of_demand.confirm.override_week_by_month'
      );
    });

    it('should return false if confirm dialog is cancelled', () => {
      data.storedBucketType = KpiBucketTypeEnum.WEEK;
      data.bucketType = KpiBucketTypeEnum.MONTH;
      jest.spyOn(global, 'confirm').mockReturnValue(false);

      const validatedForecastSetterFn =
        component['validatedForecastSetter'](data);
      const result = validatedForecastSetterFn(params);

      expect(result).toBe(false);
    });

    it('should call updateData if confirm dialog is accepted', () => {
      data.storedBucketType = KpiBucketTypeEnum.WEEK;
      data.bucketType = KpiBucketTypeEnum.MONTH;
      jest.spyOn(global, 'confirm').mockReturnValue(true);
      const updateDataSpy = jest
        .spyOn(component as any, 'updateData')
        .mockReturnValue(true);
      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);

      const validatedForecastSetterFn =
        component['validatedForecastSetter'](data);
      const result = validatedForecastSetterFn(params);

      expect(updateDataSpy).toHaveBeenCalledWith(params);
      expect(result).toBe(true);
    });

    it('should call updateData if no confirm dialog is needed', () => {
      const updateDataSpy = jest
        .spyOn(component as any, 'updateData')
        .mockReturnValue(true);

      jest.spyOn(component as any, 'isEditable').mockReturnValue(true);

      const validatedForecastSetterFn =
        component['validatedForecastSetter'](data);
      const result = validatedForecastSetterFn(params);

      expect(updateDataSpy).toHaveBeenCalledWith(params);
      expect(result).toBe(true);
    });

    it('should return false if updateData returns false', () => {
      jest.spyOn(component as any, 'updateData').mockReturnValue(false);

      const validatedForecastSetterFn =
        component['validatedForecastSetter'](data);
      const result = validatedForecastSetterFn(params);

      expect(result).toBe(false);
    });
  });

  describe('updateData', () => {
    let params: ValueSetterParams;
    let kpiData: KpiData;

    beforeEach(() => {
      jest
        .spyOn(ValidationHelper, 'getDecimalSeparatorForActiveLocale')
        .mockReturnValue('PERIOD');

      kpiData = {
        data: [
          {
            fromDate: '2023-01-01',
            deliveriesActive: 10,
            firmBusinessActive: 5,
            bucketType: 'MONTH',
            storedBucketType: 'MONTH',
          },
          {
            fromDate: '2023-02-01',
            deliveriesActive: 15,
            firmBusinessActive: 10,
            bucketType: 'MONTH',
            storedBucketType: 'MONTH',
          },
        ],
        materialNumber: '123',
        customerNumber: '456',
      } as KpiData;

      params = {
        oldValue: '10',
        newValue: '20',
        data: {
          key: jest.fn().mockReturnValue('deliveriesActive'),
        },
        column: {
          getColId: jest.fn().mockReturnValue('2023-01-01'),
        },
        node: {
          expanded: true,
        },
      } as unknown as ValueSetterParams;

      component['kpiData'].set(kpiData);
    });

    it('should return false if rowKey is not found', () => {
      params.data.key = jest.fn().mockReturnValue(null);

      const result = component['updateData'](params);

      expect(result).toBe(false);
    });

    it('should return false if kpiEntryIndex is -1', () => {
      params.column.getColId = jest.fn().mockReturnValue('2023-03-01');

      const result = component['updateData'](params);

      expect(result).toBe(false);
    });

    it('should update kpiData with the new value', () => {
      const updateSpy = jest.spyOn(component['kpiData'], 'update');

      component['updateData'](params);

      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      const updateFunction = updateSpy.mock.calls[0][0];
      const updatedKpiData = updateFunction(kpiData);
      expect(updatedKpiData.data[0].deliveriesActive).toBe(20);
    });

    it('should update changedData with the new value', () => {
      const updateSpy = jest.spyOn(component['changedData'], 'update');

      component['updateData'](params);

      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      const updateFunction = updateSpy.mock.calls[0][0];
      const updatedChangedData = updateFunction({});
      expect((updatedChangedData['2023-01-01'] as any).deliveriesActive).toBe(
        20
      );
    });

    it('should emit valuesChanged with the updated data', () => {
      const emitSpy = jest.spyOn(component['valuesChanged'], 'emit');

      component['updateData'](params);

      expect(emitSpy).toHaveBeenCalledWith({
        materialNumber: '123',
        customerNumber: '456',
        kpiEntries: [
          {
            fromDate: '2023-01-01',
            bucketType: 'MONTH',
            deliveriesActive: 20,
          },
        ],
      });
    });

    it('should parse the new value as an integer if it is a valid number', () => {
      params.newValue = '30.5';
      const updateSpy = jest.spyOn(component['kpiData'], 'update');

      component['updateData'](params);

      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      const updateFunction = updateSpy.mock.calls[0][0];
      const updatedKpiData = updateFunction(kpiData);
      expect(updatedKpiData.data[0].deliveriesActive).toBe(30);
    });

    it('should return true if the update is successful', () => {
      const result = component['updateData'](params);

      expect(result).toBe(true);
    });
  });

  describe('onHeaderClick', () => {
    let entry: KpiEntry;

    beforeEach(() => {
      entry = {
        fromDate: '2023-01-01',
      } as KpiEntry;
    });

    it('should not proceed if confirmContinueAndLooseUnsavedChanges returns false', () => {
      const confirmSpy = jest
        .spyOn(component, 'confirmContinueAndLooseUnsavedChanges')
        .mockReturnValue(() => false);

      component['onHeaderClick'](entry);

      expect(confirmSpy).toHaveBeenCalled();
      expect(component['kpiDateExceptions']()).toEqual([]);
    });

    it('should add startOfMonthPeriod to kpiDateExceptions if not already present', () => {
      const confirmSpy = jest
        .spyOn(component, 'confirmContinueAndLooseUnsavedChanges')
        .mockReturnValue(() => true);
      const startOfMonthPeriod = startOfMonth(parseISO(entry.fromDate));

      component['onHeaderClick'](entry);

      expect(confirmSpy).toHaveBeenCalled();
      expect(component['kpiDateExceptions']()).toEqual([startOfMonthPeriod]);
    });

    it('should remove startOfMonthPeriod from kpiDateExceptions if already present', () => {
      const confirmSpy = jest
        .spyOn(component, 'confirmContinueAndLooseUnsavedChanges')
        .mockReturnValue(() => true);
      const startOfMonthPeriod = startOfMonth(parseISO(entry.fromDate));
      component['kpiDateExceptions'].set([startOfMonthPeriod]);

      component['onHeaderClick'](entry);

      expect(confirmSpy).toHaveBeenCalled();
      expect(component['kpiDateExceptions']()).not.toContain(
        startOfMonthPeriod
      );
    });

    it('should handle multiple kpiDateExceptions correctly', () => {
      const confirmSpy = jest
        .spyOn(component, 'confirmContinueAndLooseUnsavedChanges')
        .mockReturnValue(() => true);
      const startOfMonthPeriod1 = startOfMonth(parseISO('2023-01-01'));
      const startOfMonthPeriod2 = startOfMonth(parseISO('2023-02-01'));
      component['kpiDateExceptions'].set([startOfMonthPeriod1]);

      component['onHeaderClick']({
        fromDate: '2023-02-01',
      } as KpiEntry);

      expect(confirmSpy).toHaveBeenCalled();
      expect(component['kpiDateExceptions']()).toEqual([
        startOfMonthPeriod1,
        startOfMonthPeriod2,
      ]);
    });
  });

  describe('constructor', () => {
    let materialListEntry: MaterialListEntry;
    let kpiDateRange: KpiDateRanges;
    let kpiDateExceptions: Date[];

    beforeEach(() => {
      materialListEntry = { id: '123' } as MaterialListEntry;
      kpiDateRange = {} as KpiDateRanges;
      kpiDateExceptions = [];

      Stub.setInputs([
        { property: 'materialListEntry', value: materialListEntry },
        { property: 'planningView', value: PlanningView.REQUESTED },
        { property: 'kpiDateRange', value: kpiDateRange },
        { property: 'reloadRequired', value: 0 },
        { property: 'showLoader', value: false },
      ]);
      Stub.detectChanges();

      jest.spyOn(component as any, 'loadKPIs').mockImplementation();
      jest.spyOn(component as any, 'updateColumnDefs').mockImplementation();
      jest.spyOn(component as any, 'updateRowData').mockImplementation();
    });

    it('should call loadKPIs when reloadRequired changes', () => {
      const loadKPIsSpy = jest.spyOn(component as any, 'loadKPIs');

      Stub.setInput('reloadRequired', 1);
      Stub.detectChanges();

      expect(loadKPIsSpy).toHaveBeenCalledWith(
        materialListEntry,
        kpiDateRange,
        kpiDateExceptions
      );
    });

    it('should not call loadKPIs when reloadRequired is negative', () => {
      const loadKPIsSpy = jest.spyOn(component as any, 'loadKPIs');
      loadKPIsSpy.mockClear();

      Stub.setInput('reloadRequired', -1);
      Stub.detectChanges();

      expect(loadKPIsSpy).not.toHaveBeenCalled();
    });

    describe('column definitions effect', () => {
      it('should update column defs when filterValues changes', () => {
        const updateColumnDefsSpy = jest.spyOn(
          component as any,
          'updateColumnDefs'
        );
        updateColumnDefsSpy.mockClear();

        component['filterValues'].update(() => ({
          [KpiType.Deliveries]: false,
          [KpiType.FirmBusiness]: true,
          [KpiType.ForecastProposal]: true,
          [KpiType.ForecastProposalDemandPlanner]: true,
          [KpiType.ValidatedForecast]: true,
          [KpiType.DemandRelevantSales]: true,
          [KpiType.SalesAmbition]: true,
          [KpiType.Opportunities]: true,
          [KpiType.SalesPlan]: true,
        }));
        Stub.detectChanges();

        expect(updateColumnDefsSpy).toHaveBeenCalledWith(
          component['kpiData']()
        );
      });

      it('should update column defs when kpiData changes', () => {
        const updateColumnDefsSpy = jest.spyOn(
          component as any,
          'updateColumnDefs'
        );
        updateColumnDefsSpy.mockClear();

        component['kpiData'].set({} as KpiData);
        Stub.detectChanges();

        expect(updateColumnDefsSpy).toHaveBeenCalledWith(
          component['kpiData']()
        );
      });

      it('should update cellRendererParams when kpiData is available', () => {
        // Create a spy for the cellRendererParams.showSyncIcon function to check its implementation
        const mockCellRendererParams = {
          showSyncIcon: jest.fn(),
          syncIconTooltip: '',
        };

        component['gridOptions'].autoGroupColumnDef.cellRendererParams =
          mockCellRendererParams;

        // Set kpiData with isValidatedForecastSynced = false
        component['kpiData'].set({
          isValidatedForecastSynced: false,
        } as KpiData);
        Stub.detectChanges();

        // Create a mock params object that includes KpiType.ValidatedForecast in the path
        const mockParams = {
          data: {
            path: [KpiType.ValidatedForecast],
          },
        };

        // Get the updated showSyncIcon function from the component's gridOptions
        const showSyncIconFn =
          component['gridOptions'].autoGroupColumnDef.cellRendererParams
            .showSyncIcon;

        // Call the function with our mock params
        const result = showSyncIconFn(mockParams as any);

        // It should return true because path includes ValidatedForecast and isValidatedForecastSynced is false
        expect(result).toBe(true);

        // Now test with a different path that doesn't include ValidatedForecast
        const otherPathParams = {
          data: {
            path: [KpiType.Deliveries],
          },
        };

        const otherResult = showSyncIconFn(otherPathParams as any);

        // Should return false as the path doesn't include ValidatedForecast
        expect(otherResult).toBe(false);

        // Check that syncIconTooltip was set correctly
        expect(
          component['gridOptions'].autoGroupColumnDef.cellRendererParams
            .syncIconTooltip
        ).toBe('validation_of_demand.planningTable.validatedForecastTooltip');
      });
    });

    describe('row data effect', () => {
      it('should update row data when planningView changes', () => {
        const updateRowDataSpy = jest.spyOn(component as any, 'updateRowData');
        updateRowDataSpy.mockClear();

        Stub.setInput('planningView', PlanningView.CONFIRMED);
        Stub.detectChanges();

        expect(updateRowDataSpy).toHaveBeenCalled();
      });

      it('should update row data when filterValues changes', () => {
        const updateRowDataSpy = jest.spyOn(component as any, 'updateRowData');
        updateRowDataSpy.mockClear();

        component['filterValues'].update(() => ({
          [KpiType.Deliveries]: false,
          [KpiType.FirmBusiness]: true,
          [KpiType.ForecastProposal]: true,
          [KpiType.ForecastProposalDemandPlanner]: true,
          [KpiType.ValidatedForecast]: true,
          [KpiType.DemandRelevantSales]: true,
          [KpiType.SalesAmbition]: true,
          [KpiType.Opportunities]: true,
          [KpiType.SalesPlan]: true,
        }));
        Stub.detectChanges();

        expect(updateRowDataSpy).toHaveBeenCalled();
      });
    });
  });
});
