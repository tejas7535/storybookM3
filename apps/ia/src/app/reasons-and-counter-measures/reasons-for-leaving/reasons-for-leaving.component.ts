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
import { EXIT_SURVEY_URL } from '../../shared/urls';
import {
  AnalysisData,
  GeneralQuestionsGridData,
  ReasonForLeavingRank,
  ReasonForLeavingTab,
} from '../models';
import {
  loadComparedLeaversByReason,
  loadLeaversByReason,
  selectComparedReason,
  selectReason,
  selectReasonsForLeavingTab,
  toggleComparedReasonAnalysis,
  toggleReasonAnalysis,
} from '../store/actions/reasons-and-counter-measures.actions';
import {
  getComparedConductedInterviewsInfo,
  getComparedGeneralQuestionsAnalysis,
  getComparedReasonAnalysisLoading,
  getComparedReasonsChartData,
  getComparedReasonsChildren,
  getComparedReasonsLoading,
  getComparedReasonsTableData,
  getConductedInterviewsInfo,
  getCurrentTab,
  getGeneralQuestionsAnalysis,
  getLeaversByReasonData,
  getLeaversByReasonLoading,
  getReasonAnalysisLoading,
  getReasonsChartData,
  getReasonsChildren,
  getReasonsLoading,
  getReasonsTableData,
} from '../store/selectors/reasons-and-counter-measures.selector';

@Component({
  selector: 'ia-reasons-for-leaving',
  templateUrl: './reasons-for-leaving.component.html',
  standalone: false,
})
export class ReasonsForLeavingComponent implements OnInit {
  readonly translationPath = 'reasonsAndCounterMeasures.reasonsForLeaving.tabs';
  readonly exitSurveyURL = EXIT_SURVEY_URL;
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
  reasonsLoading$: Observable<boolean>;
  reasonsTableData$: Observable<(ReasonForLeavingRank | AnalysisData)[]>;
  reasonsChartData$: Observable<DoughnutChartData[]>;
  reasonsChildren$: Observable<
    { reason: string; children: DoughnutChartData[] }[]
  >;
  conductedInterviewsInfo$: Observable<{
    conducted: number;
  }>;
  comparedReasonsLoading$: Observable<boolean>;
  comparedReasonsTableData$: Observable<
    (ReasonForLeavingRank | AnalysisData)[]
  >;
  comparedReasonsChartData$: Observable<DoughnutChartData[]>;
  comparedReasonsChildren$: Observable<
    { reason: string; children: DoughnutChartData[] }[]
  >;
  comparedConductedInterviewsInfo$: Observable<{
    conducted: number;
  }>;
  leaversLoading$: Observable<boolean>;
  leaversData$: Observable<ExitEntryEmployeesResponse>;
  beautifiedFilters$: Observable<EmployeeListDialogMetaFilters>;
  timeRange$: Observable<IdValue>;

  generalQuestionsData$: Observable<GeneralQuestionsGridData[]>;
  comparedGeneralQuestionsData$: Observable<GeneralQuestionsGridData[]>;
  reasonAnalysisLoading$: Observable<boolean>;
  comparedReasonAnalysisLoading$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.selectedTab$ = this.store.select(getCurrentTab);
    this.reasonsLoading$ = this.store.select(getReasonsLoading);
    this.reasonsTableData$ = this.store.select(getReasonsTableData);
    this.reasonsChartData$ = this.store.select(getReasonsChartData);
    this.reasonsChildren$ = this.store.select(getReasonsChildren);
    this.conductedInterviewsInfo$ = this.store.select(
      getConductedInterviewsInfo
    );
    this.comparedReasonsLoading$ = this.store.select(getComparedReasonsLoading);
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

    this.reasonAnalysisLoading$ = this.store.select(getReasonAnalysisLoading);
    this.comparedReasonAnalysisLoading$ = this.store.select(
      getComparedReasonAnalysisLoading
    );
    this.generalQuestionsData$ = this.store.select(getGeneralQuestionsAnalysis);
    this.comparedGeneralQuestionsData$ = this.store.select(
      getComparedGeneralQuestionsAnalysis
    );
  }

  onLeaversRequested(reason: {
    reasonId: number;
    detailedReasonId?: number;
  }): void {
    this.store.dispatch(
      loadLeaversByReason({
        reasonId: reason.reasonId,
        detailedReasonId: reason.detailedReasonId,
      })
    );
  }

  onComparedLeaversRequested(reason: {
    reasonId: number;
    detailedReasonId?: number;
  }): void {
    this.store.dispatch(
      loadComparedLeaversByReason({
        reasonId: reason.reasonId,
        detailedReasonId: reason.detailedReasonId,
      })
    );
  }

  onSelectedTabChange(selectedTab: string): void {
    const reasonType = Object.values(ReasonForLeavingTab).find(
      (tab) => tab === selectedTab
    );
    if (reasonType) {
      this.store.dispatch(
        selectReasonsForLeavingTab({
          selectedTab: reasonType,
        })
      );
    }
  }

  onSelectedReason(reason: string): void {
    this.store.dispatch(selectReason({ reason }));
  }

  onSelectedComparedReason(reason: string): void {
    this.store.dispatch(selectComparedReason({ reason }));
  }

  onToggleReasonAnalysis(reasonId: number): void {
    this.store.dispatch(toggleReasonAnalysis({ reasonId }));
  }

  onComparedToggleReasonAnalysis(reasonId: number): void {
    this.store.dispatch(toggleComparedReasonAnalysis({ reasonId }));
  }
}
