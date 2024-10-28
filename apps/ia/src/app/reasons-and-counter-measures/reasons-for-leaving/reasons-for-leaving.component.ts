import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getBeautifiedFilterValues,
  getSelectedTimeRange,
} from '../../core/store/selectors';
import { ExitEntryEmployeesResponse } from '../../overview/models';
import { DoughnutChartData } from '../../shared/charts/models';
import { EmployeeListDialogMetaFilters } from '../../shared/dialogs/employee-list-dialog/models';
import { IdValue } from '../../shared/models';
import { NavItem } from '../../shared/nav-buttons/models';
import { ReasonForLeavingRank, ReasonForLeavingTab } from '../models';
import {
  loadComparedLeaversByReason,
  loadLeaversByReason,
  selectReasonsForLeavingTab,
} from '../store/actions/reasons-and-counter-measures.actions';
import {
  getComparedConductedInterviewsInfo,
  getComparedReasonsChartData,
  getComparedReasonsChildren,
  getComparedReasonsTableData,
  getConductedInterviewsInfo,
  getCurrentTab,
  getLeaversByReasonData,
  getLeaversByReasonLoading,
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
      translation: `${this.translationPath}.${ReasonForLeavingTab.TOP_REASONS}.title`,
      icon: 'info',
      tooltipTranslation: `${this.translationPath}.${ReasonForLeavingTab.TOP_REASONS}.tooltip`,
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
  leaversLoading$: Observable<boolean>;
  leaversData$: Observable<ExitEntryEmployeesResponse>;
  beautifiedFilters$: Observable<EmployeeListDialogMetaFilters>;
  timeRange$: Observable<IdValue>;

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
    this.comparedReasonsChildren$ = this.store.select(
      getComparedReasonsChildren
    );
    this.comparedConductedInterviewsInfo$ = this.store.select(
      getComparedConductedInterviewsInfo
    );
    this.leaversLoading$ = this.store.select(getLeaversByReasonLoading);
    this.leaversData$ = this.store.select(getLeaversByReasonData);
    this.beautifiedFilters$ = this.store.select(getBeautifiedFilterValues);
    this.timeRange$ = this.store.select(getSelectedTimeRange);
  }

  onLeaversRequested(reasonId: number): void {
    this.store.dispatch(loadLeaversByReason({ reasonId }));
  }

  onComparedLeaversRequested(reasonId: number): void {
    this.store.dispatch(loadComparedLeaversByReason({ reasonId }));
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
