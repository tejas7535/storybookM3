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
import { configureTestSuite } from 'ng-bullet';

import { MultiInputComponent } from './multi-input.component';

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
        { headerName: 'Customer Number', field: 'cutomer-number' },
        { headerName: 'Sector GPSD', field: 'sector-GPSD' },
        { headerName: 'Sold to Party', field: 'sold-to-Party' },
        { headerName: 'Material Number', field: 'material-number' },
        { headerName: 'Quantity', field: 'quantity' },
      ]);
    });

    test('to keyaccount', () => {
      component.changeColumnDefs('keyaccount');

      expect(component.columnDefs).toEqual([
        { headerName: 'Key Account Number', field: 'key-account-number' },
        { headerName: 'Region', field: 'region' },
        { headerName: 'Sub-Region', field: 'sub-region' },
        { headerName: 'Sector Management', field: 'sector-management' },
        { headerName: 'Main Sector', field: 'sub-sector' },
        { headerName: 'Sub Sector', field: 'sub-Sector' },
        { headerName: 'Sector GPSD', field: 'sector-GPSD' },
        { headerName: 'Sold to Party', field: 'sold-to-Party' },
        { headerName: 'Material Number', field: 'material-number' },
        { headerName: 'Quantity', field: 'quantity' },
      ]);
    });

    test('to subkeyaccount', () => {
      component.changeColumnDefs('subkeyaccount');

      expect(component.columnDefs).toEqual([
        {
          headerName: 'Sub Key Account Number',
          field: 'sub-key-account-number',
        },
        { headerName: 'Region', field: 'region' },
        { headerName: 'Sub-Region', field: 'sub-region' },
        { headerName: 'Sector Management', field: 'sector-management' },
        { headerName: 'Main Sector', field: 'sub-sector' },
        { headerName: 'Sub Sector', field: 'sub-Sector' },
        { headerName: 'Sector GPSD', field: 'sector-GPSD' },
        { headerName: 'Sold to Party', field: 'sold-to-Party' },
        { headerName: 'Material Number', field: 'material-number' },
        { headerName: 'Quantity', field: 'quantity' },
      ]);
    });

    test('to sector', () => {
      component.changeColumnDefs('sector');

      expect(component.columnDefs).toEqual([
        { headerName: 'Country', field: 'country' },
        { headerName: '(Sub-) Sector', field: 'sector' },
        { headerName: 'Material Number', field: 'material-number' },
        { headerName: 'Quantity', field: 'quantity' },
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
