import { Component, Input } from '@angular/core';

@Component({
  selector: 'mac-ltp-kpi',
  templateUrl: './kpi.component.html',
})
export class KpiComponent {
  @Input() value: string | number;
  @Input() description: string;
  @Input() descriptionParams: any; // TODO: define model
  @Input() tooltip: string;
}
