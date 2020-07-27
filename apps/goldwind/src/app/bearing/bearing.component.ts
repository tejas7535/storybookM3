import { Component } from '@angular/core';

import { BearingRoutePath } from './bearing-route-path.enum';

interface TabLinks {
  name: string;
  link: string;
}
@Component({
  selector: 'goldwind-bearing',
  templateUrl: './bearing.component.html',
})
export class BearingComponent {
  tabLinks: TabLinks[] = [
    {
      name: 'overview',
      link: BearingRoutePath.ConditionMonitoringPath,
    },
    {
      name: 'bearing_load_and_assessment',
      link: BearingRoutePath.BasePath,
    },
    {
      name: 'grease_status',
      link: BearingRoutePath.BasePath,
    },
    {
      name: 'data_view',
      link: BearingRoutePath.BasePath,
    },
  ];

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
