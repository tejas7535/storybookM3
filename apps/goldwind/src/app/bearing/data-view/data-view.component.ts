import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ClientSideRowModelModule } from '@ag-grid-community/all-modules';
import { RowGroupingModule } from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';

import {
  setDataInterval,
  setFrequency,
} from '../../core/store/actions/data-view/data-view.actions';
import { DataViewState } from '../../core/store/reducers/data-view/data-view.reducer';
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
      maxValue: 50.0,
      notification: undefined,
    },
    {
      description: 'Lifetime',
      abreviation: 'Lhr',
      designValue: 23000.0,
      actualValue: 270000.0,
      minValue: 245000.0,
      maxValue: 1000000.0,
      notification: undefined,
    },
    {
      type: 'Load',
      description: 'Radial Load y',
      abreviation: 'F_y',
      designValue: undefined,
      actualValue: 1635.0,
      minValue: 1700.0,
      maxValue: 1900.0,
      notification: undefined,
    },
    {
      type: 'Load',
      description: 'Radial Load z',
      abreviation: 'F_z',
      designValue: undefined,
      actualValue: 87.0,
      minValue: 100.0,
      maxValue: -200.0,
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
    floatingFilter: true,
  };

  columnDefs = [
    { field: 'type', rowGroup: true, hide: true },
    {
      headerName: translate('dataView.description'),
      field: 'description',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { headerName: translate('dataView.abreviation'), field: 'abreviation' },
    { headerName: translate('dataView.designValue'), field: 'designValue' },
    { headerName: translate('dataView.actualValue'), field: 'actualValue' },
    { headerName: translate('dataView.minValue'), field: 'minValue' },
    { headerName: translate('dataView.maxValue'), field: 'maxValue' },
    { headerName: translate('dataView.notification'), field: 'notification' },
  ];

  autoGroupColumnDef = {
    headerName: translate('dataView.group'),
    cellRendererParams: {
      suppressCount: true,
    },
  };

  frequencies = [
    { value: 1, viewValue: '1 Hz' },
    { value: 10, viewValue: '10 Hz' },
    { value: 100, viewValue: '100 Hz' },
    { value: 1000, viewValue: '1000 Hz' },
  ];

  public constructor(private readonly store: Store<DataViewState>) {}

  ngOnInit(): void {
    this.data$ = this.store.pipe(select(getDataResult));
    this.interval$ = this.store.pipe(select(getDataInterval));
    this.frequency$ = this.store.pipe(select(getFrequency));
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

  exportAsCsv(): void {
    const toExport = this.gridApi
      .getSelectedRows()
      .map((rows: any) => rows.description);

    alert(`Future Export will include: ${toExport.toString()}`);
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
