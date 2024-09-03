import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { DoughnutChartData } from '../../shared/charts/models';
import { ReasonForLeavingRank } from '../models';
import {
  getComparedConductedInterviewsInfo,
  getConductedInterviewsInfo,
  getOverallComparedReasonsChartData,
  getOverallComparedReasonsTableData,
  getOverallReasonsChartData,
  getOverallReasonsTableData,
} from '../store/selectors/reasons-and-counter-measures.selector';

@Component({
  selector: 'ia-reasons-for-leaving',
  templateUrl: './reasons-for-leaving.component.html',
})
export class ReasonsForLeavingComponent implements OnInit {
  reasonsTableData$: Observable<ReasonForLeavingRank[]>;
  reasonsChartData$: Observable<DoughnutChartData[]>;
  conductedInterviewsInfo$: Observable<{
    conducted: number;
    percentage: number;
  }>;
  comparedReasonsTableData$: Observable<ReasonForLeavingRank[]>;
  comparedReasonsChartData$: Observable<DoughnutChartData[]>;
  comparedConductedInterviewsInfo$: Observable<{
    conducted: number;
    percentage: number;
  }>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.reasonsTableData$ = this.store.select(getOverallReasonsTableData);
    this.reasonsChartData$ = this.store.select(getOverallReasonsChartData);
    this.conductedInterviewsInfo$ = this.store.select(
      getConductedInterviewsInfo
    );
    this.comparedReasonsTableData$ = this.store.select(
      getOverallComparedReasonsTableData
    );
    this.comparedReasonsChartData$ = this.store.select(
      getOverallComparedReasonsChartData
    );
    this.comparedConductedInterviewsInfo$ = this.store.select(
      getComparedConductedInterviewsInfo
    );
  }
}
