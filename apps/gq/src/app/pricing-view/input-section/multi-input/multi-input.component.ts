import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import {
  ColDef,
  Column,
  ColumnApi,
  GridApi,
  RowNode,
} from '@ag-grid-community/core';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gq-multi-input',
  templateUrl: './multi-input.component.html',
  styleUrls: ['./multi-input.component.scss'],
})
export class MultiInputComponent implements OnInit, OnDestroy {
  form = new FormControl();

  rowSelection = 'multiple';
  rowData: any = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  defaultColumnDefs: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  public modules = [
    ClientSideRowModelModule,
    RangeSelectionModule,
    ClipboardModule,
  ];
  columnDefs = [
    { headerName: 'Customer Number', field: 'cutomer-number' },
    { headerName: 'Sector GPSD', field: 'sector-GPSD' },
    { headerName: 'Sold to Party', field: 'sold-to-Party' },
    { headerName: 'Material Number', field: 'material-number' },
    { headerName: 'Quantity', field: 'quantity' },
  ];

  readonly subscription: Subscription = new Subscription();

  constructor(public dialogRef: MatDialogRef<MultiInputComponent>) {}

  ngOnInit(): void {
    this.form.setValue('customer');
    this.subscription.add(
      this.form.valueChanges.subscribe((value) => {
        this.changeColumnDefs(value);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeColumnDefs(value: string): void {
    switch (value) {
      case 'keyaccount':
        this.columnDefs = [
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
        ];
        break;
      case 'subkeyaccount':
        this.columnDefs = [
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
        ];
        break;
      case 'sector':
        this.columnDefs = [
          { headerName: 'Country', field: 'country' },
          { headerName: '(Sub-) Sector', field: 'sector' },
          { headerName: 'Material Number', field: 'material-number' },
          { headerName: 'Quantity', field: 'quantity' },
        ];
        break;
      case 'customer':
      default:
        this.columnDefs = [
          { headerName: 'Customer Number', field: 'cutomer-number' },
          { headerName: 'Sector GPSD', field: 'sector-GPSD' },
          { headerName: 'Sold to Party', field: 'sold-to-Party' },
          { headerName: 'Material Number', field: 'material-number' },
          { headerName: 'Quantity', field: 'quantity' },
        ];
        break;
    }
    this.rowData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  }

  onGridReady(params: any): void {
    const gridApi: GridApi = params.api;
    gridApi.sizeColumnsToFit();
  }

  processCellFromClipboard(params: any): string {
    const gridApi: GridApi = params.api;
    const columnApi: ColumnApi = params.columnApi;
    const rowNode: RowNode = params.node;
    const lastDisplayedRow = gridApi.getLastDisplayedRow();

    const cull: Column[] = columnApi.getAllGridColumns();

    if (
      String(lastDisplayedRow) === rowNode.id &&
      params.column.colId === cull[cull.length - 1].getColId()
    ) {
      gridApi.applyTransaction({ add: [{}] });
    }

    return params.value ? params.value : undefined;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
