import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';
import { EChartOption } from 'echarts';

import { ShaftState } from '../../../core/store/reducers/shaft/shaft.reducer';
import { GraphData } from '../../../core/store/reducers/shared/models';
import { getShaftLatestGraphData } from '../../../core/store/selectors/';
import { chartOptions } from '../../../shared/chart/chart';
import { UPDATE_SETTINGS } from '../../../shared/constants';
import { BearingRoutePath } from '../../bearing-route-path.enum';

@Component({
  selector: 'goldwind-shaft',
  templateUrl: './shaft.component.html',
  styleUrls: ['./shaft.component.scss'],
})
export class ShaftComponent implements OnInit {
  shaftLatestGraphData$: Observable<GraphData>;
  refresh = UPDATE_SETTINGS.shaft.refresh;
  chartOptions: EChartOption = {
    ...chartOptions,
    legend: {
      ...chartOptions.legend,
      show: false,
    },
  };

  public constructor(
    private readonly store: Store<ShaftState>,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.shaftLatestGraphData$ = this.store.pipe(
      select(getShaftLatestGraphData)
    );
  }

  navigateToGreaseStatus(): void {
    this.router.navigate([`../${BearingRoutePath.GreaseStatusPath}`], {
      relativeTo: this.activatedRoute.parent,
    });
  }
}
