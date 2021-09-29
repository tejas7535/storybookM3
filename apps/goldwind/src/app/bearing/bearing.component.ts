import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  disabled?: boolean;
}
@Component({
  selector: 'goldwind-bearing',
  templateUrl: './bearing.component.html',
  styleUrls: ['./bearing.component.scss'],
})
export class BearingComponent implements OnInit {
  bearing$: Observable<BearingMetadata>;
  loading$: Observable<boolean>;

  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

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
      disabled: true,
    },
  ];

  ngOnInit(): void {
    this.bearing$ = this.store.select(getBearingResult);
    this.loading$ = this.store.select(getBearingLoading);
  }

  navigateBack(): void {
    this.router.navigate(['/overview']);
  }
  /**
   *
   */
  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
