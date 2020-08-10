import { Component, Input } from '@angular/core';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import { Edm } from '../../../core/store/reducers/thing/models';

@Component({
  selector: 'goldwind-edm-monitor',
  templateUrl: './edm-monitor.component.html',
  styleUrls: ['./edm-monitor.component.scss'],
})
export class EdmMonitorComponent {
  public modules = [ClientSideRowModelModule];
  public columnDefs = [
    { field: 'id' },
    { field: 'sensorId' },
    { field: 'startDate' },
    { field: 'endDate' },
    { field: 'edmValue1Counter' },
    { field: 'edmValue2Counter' },
    { field: 'sampleRatio' },
  ];
  @Input() edm: Edm;
}
