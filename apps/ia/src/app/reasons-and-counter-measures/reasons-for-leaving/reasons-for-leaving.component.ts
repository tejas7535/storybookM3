import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { DoughnutChartData } from '../../shared/charts/models';
import { NavItem } from '../../shared/nav-buttons/models';
import { ReasonForLeavingRank, ReasonForLeavingTab } from '../models';
import { selectReasonsForLeavingTab } from '../store/actions/reasons-and-counter-measures.actions';
import {
  getComparedConductedInterviewsInfo,
  getComparedReasonsChartData,
  getComparedReasonsTableData,
  getConductedInterviewsInfo,
  getCurrentTab,
  getReasonsChartData,
  getReasonsChildren,
  getReasonsTableData,
} from '../store/selectors/reasons-and-counter-measures.selector';

@Component({
  selector: 'ia-reasons-for-leaving',
  templateUrl: './reasons-for-leaving.component.html',
})
export class ReasonsForLeavingComponent implements OnInit {
  readonly translationPath = 'reasonsAndCounterMeasures.reasonsForLeaving.tabs';

  navItems: NavItem[] = [
    {
      label: ReasonForLeavingTab.OVERALL_REASONS,
      translation: `${this.translationPath}.${ReasonForLeavingTab.OVERALL_REASONS}`,
    },
    {
      label: ReasonForLeavingTab.TOP_REASONS,
      translation: `${this.translationPath}.${ReasonForLeavingTab.TOP_REASONS}`,
    },
  ];

  selectedTab$: Observable<ReasonForLeavingTab>;
  reasonsTableData$: Observable<ReasonForLeavingRank[]>;
  reasonsChartData$: Observable<DoughnutChartData[]>;
  reasonsChildren$: Observable<
    { reason: string; children: DoughnutChartData[] }[]
  >;
  conductedInterviewsInfo$: Observable<{
    conducted: number;
    percentage: number;
  }>;
  comparedReasonsTableData$: Observable<ReasonForLeavingRank[]>;
  comparedReasonsChartData$: Observable<DoughnutChartData[]>;
  comparedReasonsChildren$: Observable<
    { reason: string; children: DoughnutChartData[] }[]
  >;
  comparedConductedInterviewsInfo$: Observable<{
    conducted: number;
    percentage: number;
  }>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.selectedTab$ = this.store.select(getCurrentTab);
    this.reasonsTableData$ = this.store.select(getReasonsTableData);
    this.reasonsChartData$ = this.store.select(getReasonsChartData);
    this.reasonsChildren$ = this.store.select(getReasonsChildren);
    this.conductedInterviewsInfo$ = this.store.select(
      getConductedInterviewsInfo
    );
    this.comparedReasonsTableData$ = this.store.select(
      getComparedReasonsTableData
    );
    this.comparedReasonsChartData$ = this.store.select(
      getComparedReasonsChartData
    );
    this.comparedReasonsChildren$ = this.store.select(getReasonsChildren);
    this.comparedConductedInterviewsInfo$ = this.store.select(
      getComparedConductedInterviewsInfo
    );
  }

  onSelectedTabChange(selectedTab: string): void {
    const reasonType = Object.values(ReasonForLeavingTab).find(
      (tab) => tab === selectedTab
    );
    this.store.dispatch(
      selectReasonsForLeavingTab({
        selectedTab: reasonType,
      })
    );
  }
}
