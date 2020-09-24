import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

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
import { translate } from '@ngneat/transloco';

@Component({
  selector: 'gq-multiple-input-dialog',
  templateUrl: './multiple-input-dialog.component.html',
  styleUrls: ['./multiple-input-dialog.component.scss'],
})
export class MultipleInputDialogComponent implements OnInit, OnDestroy {
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
  columnDefs: ColDef[] = [];

  readonly subscription: Subscription = new Subscription();

  constructor(public dialogRef: MatDialogRef<MultipleInputDialogComponent>) {}

  ngOnInit(): void {
    this.form.setValue('customer');
    this.subscription.add(
      this.form.valueChanges.subscribe((value) => {
        this.changeColumnDefs(value);
      })
    );
    this.columnDefs = [
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
    ];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeColumnDefs(value: string): void {
    switch (value) {
      case 'keyAccount':
        this.columnDefs = [
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
        ];
        break;
      case 'subKeyAccount':
        this.columnDefs = [
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
        ];
        break;
      case 'sector':
        this.columnDefs = [
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
        ];
        break;
      case 'customer':
      default:
        this.columnDefs = [
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
