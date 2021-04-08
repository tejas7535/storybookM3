import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  ColumnFields,
  PriceColumns,
} from '../../services/column-utility-service/column-fields.enum';
import { ExportToExcelButtonComponent } from './export-to-excel-button.component';

describe('ExportToExcelButtonComponent', () => {
  let component: ExportToExcelButtonComponent;
  let spectator: Spectator<ExportToExcelButtonComponent>;
  let mockParams: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: ExportToExcelButtonComponent,
    declarations: [ExportToExcelButtonComponent],
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    const mockIds = [{ getColId: () => '0' }, { getColId: () => '1' }];
    mockParams = ({
      api: {
        exportDataAsExcel: jest.fn(),
      },
      columnApi: {
        getAllColumns: jest.fn(() => mockIds),
      },
    } as unknown) as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      component['params'] = undefined;

      component.agInit(mockParams);

      expect(component['params']).toEqual(mockParams);
    });
  });
  describe('exportToExcel', () => {
    test('should export to Excel', () => {
      component['params'] = mockParams;
      component.exportToExcel();

      expect(mockParams.api.exportDataAsExcel).toHaveBeenCalled();
    });
  });

  describe('proccessHeaderCallBack', () => {
    test('should return headerName', () => {
      const colDef = {
        field: ColumnFields.MATERIAL_NUMBER_15,
        headerName: 'headerName',
      };
      const params = {
        column: {
          getColDef: () => colDef,
        },
      } as any;
      const result = component.processHeaderCallback(params);
      expect(result).toEqual(colDef.headerName);
    });
    test('should return headerName and currency', () => {
      const colDef = {
        field: PriceColumns[0],
        headerName: 'headerName',
        currency: 'currency',
      };
      const params = {
        column: {
          getColDef: () => colDef,
        },
      } as any;

      const expected = `${colDef.headerName} [${params.context?.currency}]`;

      const result = component.processHeaderCallback(params);
      expect(result).toEqual(expected);
    });
  });
  describe('processCellCallback', () => {
    test('should return cell value', () => {
      const colDef = {
        field: ColumnFields.GPI,
      };
      const params = {
        value: 'value',
        column: {
          getColDef: () => colDef,
        },
      } as any;

      const result = component.processCellCallback(params);
      expect(result).toEqual(params.value);
    });
    test('should return apply valueFormatter', () => {
      const colDef = {
        field: ColumnFields.MATERIAL_NUMBER_15,
        valueFormatter: true,
      };
      const params = {
        column: {
          getColDef: () => colDef,
        },
      } as any;
      const response = 'result';
      component.applyExcelCellValueFormatter = jest.fn(() => response);

      const result = component.processCellCallback(params);
      expect(component.applyExcelCellValueFormatter).toHaveBeenCalledTimes(1);
      expect(result).toEqual(response);
    });
  });
  describe('applyExcelCellValueFormatter', () => {
    test('should return valueFormatter', () => {
      const formatterReturnValue = '1';
      const colDef = {
        valueFormatter: () => formatterReturnValue,
      };
      const params = {
        node: {},
        column: {
          getColDef: () => colDef,
        },
      } as any;

      const result = component.applyExcelCellValueFormatter(params);
      expect(result).toEqual(formatterReturnValue);
    });
  });
});
