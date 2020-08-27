import { Component, Input } from '@angular/core';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import { GreaseStatus } from '../../../core/store/reducers/grease-status/models';

@Component({
  selector: 'goldwind-grease-monitor',
  templateUrl: './grease-monitor.component.html',
  styleUrls: ['./grease-monitor.component.scss'],
})
export class GreaseMonitorComponent {
  public modules = [ClientSideRowModelModule];
  public columnDefs = [
    { field: 'id' },
    { field: 'sensorId' },
    { field: 'startDate' },
    { field: 'endDate' },
    { field: 'waterContentPercent' },
    { field: 'deteriorationPercent' },
    { field: 'temperatureCelsius' },
    { field: 'isAlarm' },
    { field: 'sampleRatio' },
  ];
  @Input() greaseStatus: GreaseStatus;
}
