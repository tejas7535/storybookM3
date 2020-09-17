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
import { translate } from '@ngneat/transloco';
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
        ];
        break;
      case 'subkeyaccount':
        this.columnDefs = [
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
        ];
        break;
      case 'sector':
        this.columnDefs = [
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
        ];
        break;
      case 'customer':
      default:
        this.columnDefs = [
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
