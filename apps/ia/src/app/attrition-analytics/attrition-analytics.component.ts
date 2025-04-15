import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { BarChartConfig } from '../shared/charts/models';
import { NavItem } from '../shared/nav-buttons/models';
import { ATTRITION_ANALYTICS_URL } from '../shared/urls';
import { selectCluster } from './store/actions/attrition-analytics.action';
import {
  getAvailableClusters,
  getClustersLoading,
  getEmployeeAnalytics,
  getEmployeeAnalyticsLoading,
  getSelectedCluster,
} from './store/selectors/attrition-analytics.selector';

@Component({
  selector: 'ia-attrition-analytics',
  templateUrl: './attrition-analytics.component.html',
  styleUrls: ['./attrition-analytics.scss'],
  standalone: false,
})
export class AttritionAnalyticsComponent {
  infoUrl = ATTRITION_ANALYTICS_URL;
  selectedCluster$: Observable<string> = this.store.select(getSelectedCluster);
  clusters$: Observable<NavItem[]> = this.store.select(getAvailableClusters);
  employeeAnalytics$: Observable<BarChartConfig[]> =
    this.store.select(getEmployeeAnalytics);
  clustersLoading$: Observable<boolean> = this.store.select(getClustersLoading);
  analyticsLoading$: Observable<boolean> = this.store.select(
    getEmployeeAnalyticsLoading
  );

  constructor(private readonly store: Store) {}

  onClusterSelected(cluster: string): void {
    this.store.dispatch(selectCluster({ cluster }));
  }
}
