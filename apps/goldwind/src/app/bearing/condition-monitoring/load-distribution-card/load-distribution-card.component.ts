import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { DATE_FORMAT, UPDATE_SETTINGS } from '../../../shared/constants';
import {
  getLoadDistributionSeries,
  getLoadDistributionTimeStamp,
} from '../../../core/store/selectors/load-distribution/load-distribution.selector';
import {
  getLoadAssessmentInterval,
  getLoadAverage,
  getLoadDistributionLatest,
  stopLoadDistributionGet,
} from '../../../core/store';
import { ActivatedRoute } from '@angular/router';
import { config } from './polar-options.echart';
@Component({
  selector: 'goldwind-load-distribution-card',
  templateUrl: './load-distribution-card.component.html',
  styleUrls: ['./load-distribution-card.component.scss'],
})
export class LoadDistributionCardComponent implements OnInit, OnDestroy {
  /**
   * Wheater or not displaying the average over interval
   */
  @Input() average = false;
  /**
   * A subscription which alway pushes the current activated route
   */
  routeParamsSub: Subscription;
  /**
   * The base config with styles and preconfigures the polar chart
   */
  chartOptions: EChartsOption = config;
  /**
   * The interval to refresh the Page
   */
  refresh = UPDATE_SETTINGS.loaddistribution.refresh;
  /**
   * the observable with combines the config and the series data
   */
  polarSeries$: Observable<EChartsOption>;
  /**
   * The latest timestamp in the retrived data array
   */
  timeStamp$: Observable<string>;
  /**
   * Indicator for current loading situation
   */
  loading$: Observable<boolean>;
  /**
   * Used to display the selected interval on the component if accessible
   */
  interval$: Observable<any>;

  /**
   *
   * @param store to retrieve data
   * @param activate to get the id of the current route
   */
  public constructor(
    private readonly store: Store,
    private readonly activate: ActivatedRoute
  ) {}

  /**
   * Unsubscribes open Observables
   */
  ngOnDestroy(): void {
    this.store.dispatch(stopLoadDistributionGet());
    this.routeParamsSub.unsubscribe();
  }

  /**
   * Setup Obersvables to keep the current state up to date with the latest data
   */
  ngOnInit(): void {
    this.routeParamsSub = this.activate.params.subscribe((params) => {
      if (!this.average) {
        this.store.dispatch(
          getLoadDistributionLatest({
            deviceId: params.id,
          })
        );
      } else {
        this.store.dispatch(
          getLoadAverage({
            deviceId: params.id,
          })
        );
      }
    });
    this.polarSeries$ = this.store.select(getLoadDistributionSeries);
    this.timeStamp$ = this.store.select(getLoadDistributionTimeStamp);
    this.interval$ = this.store.select(getLoadAssessmentInterval);
  }
}
