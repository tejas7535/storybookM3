// tslint:disable no-default-import
import { Component } from '@angular/core';

import dummyEmployeesJson from '../../assets/dummy-employees.json';

@Component({
  selector: 'ia-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  data: any = dummyEmployeesJson;
}
