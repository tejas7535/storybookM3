import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  ColDef,
  Column,
  ColumnApi,
  GridApi,
  RowNode,
} from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { translate } from '@ngneat/transloco';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../../../../assets/i18n/en.json';
import { MultipleInputDialogComponent } from './multiple-input-dialog.component';

describe('MultipleInputDialogComponent', () => {
  let component: MultipleInputDialogComponent;
  let fixture: ComponentFixture<MultipleInputDialogComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleInputDialogComponent],
      imports: [
        AgGridModule.withComponents([]),
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        FlexModule,
        NoopAnimationsModule,
        provideTranslocoTestingModule({ en }),
      ],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleInputDialogComponent);
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
            'pricingView.inputSection.multiInputDialog.tableHeader.customer'
          ),
          field: 'customer',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.sectorGPSD'
          ),
          field: 'sectorGPSD',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.soldToParty'
          ),
          field: 'soldToParty',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.materialNumber'
          ),
          field: 'materialNumber',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.quantity'
          ),
          field: 'quantity',
        },
      ]);
    });

    test('to keyAccount', () => {
      component.changeColumnDefs('keyAccount');

      expect(component.columnDefs).toEqual([
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.keyAccount'
          ),
          field: 'keyAccount',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.region'
          ),
          field: 'region',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.subRegion'
          ),
          field: 'subRegion',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.sectorManagement'
          ),
          field: 'sectorManagement',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.mainSector'
          ),
          field: 'mainSector',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.subSector'
          ),
          field: 'subSector',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.sectorGPSD'
          ),
          field: 'sectorGPSD',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.soldToParty'
          ),
          field: 'soldToParty',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.materialNumber'
          ),
          field: 'materialNumber',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.quantity'
          ),
          field: 'quantity',
        },
      ]);
    });

    test('to subKeyAccount', () => {
      component.changeColumnDefs('subKeyAccount');

      expect(component.columnDefs).toEqual([
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.subKeyAccount'
          ),
          field: 'subKeyAccount',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.country'
          ),
          field: 'country',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.subRegion'
          ),
          field: 'subRegion',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.sectorManagement'
          ),
          field: 'sectorManagement',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.mainSector'
          ),
          field: 'mainSector',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.subSector'
          ),
          field: 'subSector',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.sectorGPSD'
          ),
          field: 'sectorGPSD',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.soldToParty'
          ),
          field: 'soldToParty',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.materialNumber'
          ),
          field: 'materialNumber',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.quantity'
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
            'pricingView.inputSection.multiInputDialog.tableHeader.country'
          ),
          field: 'country',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.sector'
          ),
          field: 'sector',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.materialNumber'
          ),
          field: 'materialNumber',
        },
        {
          headerName: translate(
            'pricingView.inputSection.multiInputDialog.tableHeader.quantity'
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
