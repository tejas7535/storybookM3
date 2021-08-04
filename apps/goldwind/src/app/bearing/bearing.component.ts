import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { BearingMetadata } from '../core/store/reducers/bearing/models';
import {
  getBearingLoading,
  getBearingResult,
} from '../core/store/selectors/bearing/bearing.selector';
import { BearingRoutePath } from './bearing-route-path.enum';

interface TabLinks {
  name: string;
  link: string;
}
@Component({
  selector: 'goldwind-bearing',
  templateUrl: './bearing.component.html',
  styleUrls: ['./bearing.component.scss'],
})
export class BearingComponent implements OnInit {
  bearing$: Observable<BearingMetadata>;
  loading$: Observable<boolean>;

  public constructor(private readonly store: Store) {}

  tabLinks: TabLinks[] = [
    {
      name: 'overview',
      link: BearingRoutePath.ConditionMonitoringPath,
    },
    {
      name: 'loadAssessment',
      link: BearingRoutePath.LoadAssessmentPath,
    },
    {
      name: 'maintenanceAssessment',
      link: BearingRoutePath.MaintenanceAsseesmentPath,
    },
    {
      name: 'dataView',
      link: BearingRoutePath.DataViewPath,
    },
  ];

  ngOnInit(): void {
    this.bearing$ = this.store.select(getBearingResult);
    this.loading$ = this.store.select(getBearingLoading);
  }
  /**
   *
   */
  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
