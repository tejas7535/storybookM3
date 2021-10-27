import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ClientSideRowModelModule } from '@ag-grid-community/all-modules';
import { RowGroupingModule } from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  setDataInterval,
  setFrequency,
} from '../../core/store/actions/data-view/data-view.actions';
import { SensorData } from '../../core/store/reducers/data-view/models';
import { Interval } from '../../core/store/reducers/shared/models';
import {
  getDataInterval,
  getDataResult,
  getFrequency,
} from '../../core/store/selectors/';

@Component({
  selector: 'goldwind-data-view-monitoring',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss'],
})
export class DataViewComponent implements OnInit {
  data$: Observable<SensorData[]>;
  interval$: Observable<Interval>;
  frequency$: Observable<number>;

  // this will of course come from api/store
  rowData: SensorData[] = [
    {
      description: 'Static Safety Factor',
      abreviation: 'S_O_w',
      designValue: 2.7,
      actualValue: 3.23,
      minValue: 2.9,
      maxValue: 50,
      notification: undefined,
    },
    {
      description: 'Lifetime',
      abreviation: 'Lhr',
      designValue: 23_000,
      actualValue: 270_000,
      minValue: 245_000,
      maxValue: 1_000_000,
      notification: undefined,
    },
    {
      type: 'Load',
      description: 'Radial Load y',
      abreviation: 'F_y',
      designValue: undefined,
      actualValue: 1635,
      minValue: 1700,
      maxValue: 1900,
      notification: undefined,
    },
    {
      type: 'Load',
      description: 'Radial Load z',
      abreviation: 'F_z',
      designValue: undefined,
      actualValue: 87,
      minValue: 100,
      maxValue: -200,
      notification: undefined,
    },
  ];

  gridApi: any;
  modules = [ClientSideRowModelModule, RowGroupingModule];
  groupDefaultExpanded = -1;
  rowSelection = 'multiple';
  groupSelectsChildren = true;
  suppressRowClickSelection = true;

  defaultColDef = {
    filter: true,
    flex: 1,
    floatingFilter: true,
  };

  columnDefs = [
    { field: 'type', rowGroup: true, hide: true },
    {
      headerName: translate<string>('dataView.abreviation'),
      field: 'abreviation',
    },
    {
      headerName: translate<string>('dataView.designValue'),
      field: 'designValue',
    },
    {
      headerName: translate<string>('dataView.actualValue'),
      field: 'actualValue',
    },
    { headerName: translate<string>('dataView.minValue'), field: 'minValue' },
    { headerName: translate<string>('dataView.maxValue'), field: 'maxValue' },
    {
      headerName: translate<string>('dataView.notification'),
      field: 'notification',
    },
  ];

  autoGroupColumnDef = {
    headerName: translate<string>('dataView.description'),
    headerCheckboxSelection: true,
    field: 'description',
    minWidth: 350,
    cellRendererParams: {
      suppressCount: true,
      checkbox: true,
    },
  };

  rowClassRules = {
    'ag-row-level-1': () => true,
  };

  frequencies = [
    { value: 1, viewValue: '1 Hz' },
    { value: 10, viewValue: '10 Hz' },
    { value: 100, viewValue: '100 Hz' },
    { value: 1000, viewValue: '1000 Hz' },
  ];

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.data$ = this.store.select(getDataResult);
    this.interval$ = this.store.select(getDataInterval);
    this.frequency$ = this.store.select(getFrequency);
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  setFrequency(frequency: number): void {
    this.store.dispatch(setFrequency({ frequency }));
  }

  setInterval(interval: Interval): void {
    this.store.dispatch(setDataInterval({ interval }));
  }

  export(): void {
    const toExport = this.gridApi
      .getSelectedRows()
      .map((rows: any) => rows.description);

    alert(`Future Export will include: ${toExport.toString()}`);
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
