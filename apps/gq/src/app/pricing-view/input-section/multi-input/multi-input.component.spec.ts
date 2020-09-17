import { AgGridModule } from '@ag-grid-community/angular';
import {
  ColDef,
  Column,
  ColumnApi,
  GridApi,
  RowNode,
} from '@ag-grid-community/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { translate } from '@ngneat/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';
import { configureTestSuite } from 'ng-bullet';

import { MultiInputComponent } from './multi-input.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('MultiInputComponent', () => {
  let component: MultiInputComponent;
  let fixture: ComponentFixture<MultiInputComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MultiInputComponent],
      imports: [
        AgGridModule.withComponents([]),
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        FlexModule,
        NoopAnimationsModule,
        provideTranslocoTestingModule({}),
      ],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changeColumnDefs', () => {
    test('to customer', () => {
      component.changeColumnDefs('customer');

      expect(component.columnDefs).toEqual([
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.customerNumber'
          ),
          field: 'cutomer-number',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.sectorGPSD'
          ),
          field: 'sector-GPSD',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.soldToParty'
          ),
          field: 'sold-to-Party',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.materialNumber'
          ),
          field: 'material-number',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.quantity'
          ),
          field: 'quantity',
        },
      ]);
    });

    test('to keyaccount', () => {
      component.changeColumnDefs('keyaccount');

      expect(component.columnDefs).toEqual([
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.keyAccount'
          ),
          field: 'key-account-number',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.country'
          ),
          field: 'region',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.subRegion'
          ),
          field: 'sub-region',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.sectorManagement'
          ),
          field: 'sector-management',
        },
        { headerName: 'Main Sector', field: 'main-sector' },
        { headerName: 'Sub Sector', field: 'sub-Sector' },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.sectorGPSD'
          ),
          field: 'sector-GPSD',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.soldToParty'
          ),
          field: 'sold-to-Party',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.materialNumber'
          ),
          field: 'material-number',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.quantity'
          ),
          field: 'quantity',
        },
      ]);
    });

    test('to subkeyaccount', () => {
      component.changeColumnDefs('subkeyaccount');

      expect(component.columnDefs).toEqual([
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.subKeyAccount'
          ),
          field: 'sub-key-account-number',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.country'
          ),
          field: 'region',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.subRegion'
          ),
          field: 'sub-region',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.sectorManagement'
          ),
          field: 'sector-management',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.mainSector'
          ),
          field: 'main-sector',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.subSector'
          ),
          field: 'sub-Sector',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.sectorGPSD'
          ),
          field: 'sector-GPSD',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.soldToParty'
          ),
          field: 'sold-to-Party',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.materialNumber'
          ),
          field: 'material-number',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.quantity'
          ),
          field: 'quantity',
        },
      ]);
    });

    test('to sector', () => {
      component.changeColumnDefs('sector');

      expect(component.columnDefs).toEqual([
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.country'
          ),
          field: 'country',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.sector'
          ),
          field: 'sector',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.materialNumber'
          ),
          field: 'material-number',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInput.tableHeader.quantity'
          ),
          field: 'quantity',
        },
      ]);
    });
  });

  describe('processCellFromClipboard', () => {
    test('add new row and return value', () => {
      const gridApi = new GridApi();
      gridApi.applyTransaction = jest.fn();
      gridApi.getLastDisplayedRow = jest.fn(() => 2);
      const colDef: ColDef = { editable: true };
      const column1 = new Column(colDef, undefined, 'colId1', false);
      const column2 = new Column(colDef, undefined, 'colId2', false);
      const columnApi = new ColumnApi();
      const columns: Column[] = [column1, column2];

      columnApi.getAllGridColumns = jest.fn(() => columns);
      const rowNode = new RowNode();
      rowNode.id = '2';

      const param = {
        columnApi,
        api: gridApi,
        column: column2,
        node: rowNode,
        value: 'value',
      };
      const result: string = component.processCellFromClipboard(param);

      expect(gridApi.applyTransaction).toHaveBeenCalled();
      expect(result).toEqual('value');
    });

    test('add new row and return value', () => {
      const gridApi = new GridApi();
      gridApi.applyTransaction = jest.fn();
      gridApi.getLastDisplayedRow = jest.fn(() => 2);
      const colDef: ColDef = { editable: true };
      const column1 = new Column(colDef, undefined, 'colId1', false);
      const column2 = new Column(colDef, undefined, 'colId2', false);
      const columnApi = new ColumnApi();
      const columns: Column[] = [column1, column2];

      columnApi.getAllGridColumns = jest.fn(() => columns);
      const rowNode = new RowNode();
      rowNode.id = '1';

      const param = {
        columnApi,
        api: gridApi,
        column: column2,
        node: rowNode,
        value: 'value',
      };
      const result: string = component.processCellFromClipboard(param);

      expect(gridApi.applyTransaction).toHaveBeenCalledTimes(0);
      expect(result).toEqual('value');
    });
  });

  describe('onNoClick', () => {
    test('should close dialog without data', () => {
      component.dialogRef.close = jest.fn();
      component.onNoClick();

      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });
});
