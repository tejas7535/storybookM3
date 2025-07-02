import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getAreOpenApplicationsAvailable,
  getBeautifiedFilterValues,
  getSelectedTimeRange,
} from '../core/store/selectors';
import { ExitEntryEmployeesResponse } from '../overview/models';
import { EmployeeListDialogMetaFilters } from '../shared/dialogs/employee-list-dialog/models';
import { IdValue } from '../shared/models';
import { NavItem } from '../shared/nav-buttons/models';
import {
  JobProfile,
  LossOfSkillTab,
  PmgmData,
  WorkforceResponse,
} from './models';
import {
  loadLossOfSkillLeavers,
  loadLossOfSkillWorkforce,
  setLossOfSkillSelectedTab,
} from './store/actions/loss-of-skill.actions';
import {
  getHasUserEnoughRightsToPmgmData,
  getJobProfilesData,
  getJobProfilesLoading,
  getLossOfSkillLeaversData,
  getLossOfSkillLeaversLoading,
  getLossOfSkillSelectedTab,
  getLossOfSkillWorkforceData,
  getLossOfSkillWorkforceLoading,
  getPmgmData,
} from './store/selectors/loss-of-skill.selector';

@Component({
  selector: 'ia-loss-of-skill',
  templateUrl: './loss-of-skill.component.html',
  standalone: false,
})
export class LossOfSkillComponent implements OnInit {
  lossOfSkillTab = LossOfSkillTab;
  selectedTab$: Observable<LossOfSkillTab>;
  navItems: NavItem[] = [
    {
      label: LossOfSkillTab.PERFORMANCE,
      translation: 'lossOfSkill.tabs.performance',
    },
    {
      label: LossOfSkillTab.JOB_PROFILES,
      translation: 'lossOfSkill.tabs.jobProfiles',
    },
  ];

  beautifiedFilters$: Observable<EmployeeListDialogMetaFilters>;
  timeRange$: Observable<IdValue>;
  areOpenPositionsAvailable$: Observable<boolean>;
  lostJobProfilesLoading$: Observable<boolean>;
  lostJobProfilesData$: Observable<JobProfile[]>;
  lossOfSkillWorkforceData$: Observable<WorkforceResponse>;
  lossOfSkillWorkforceLoading$: Observable<boolean>;
  lossOfSkillLeaversData$: Observable<ExitEntryEmployeesResponse>;
  lossOfSkillLeaversLoading$: Observable<boolean>;
  pmgmData$: Observable<PmgmData[]>;
  enoughRightsToAllPmgmData$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.selectedTab$ = this.store.select(getLossOfSkillSelectedTab);
    this.beautifiedFilters$ = this.store.select(getBeautifiedFilterValues);
    this.timeRange$ = this.store.select(getSelectedTimeRange);
    this.areOpenPositionsAvailable$ = this.store.select(
      getAreOpenApplicationsAvailable
    );
    this.lostJobProfilesLoading$ = this.store.select(getJobProfilesLoading);
    this.lostJobProfilesData$ = this.store.select(getJobProfilesData);
    this.lossOfSkillWorkforceData$ = this.store.select(
      getLossOfSkillWorkforceData
    );
    this.lossOfSkillWorkforceLoading$ = this.store.select(
      getLossOfSkillWorkforceLoading
    );
    this.lossOfSkillLeaversData$ = this.store.select(getLossOfSkillLeaversData);
    this.lossOfSkillLeaversLoading$ = this.store.select(
      getLossOfSkillLeaversLoading
    );
    this.pmgmData$ = this.store.select(getPmgmData);
    this.enoughRightsToAllPmgmData$ = this.store.select(
      getHasUserEnoughRightsToPmgmData
    );
  }

  onTabChange(selectedTab: string): void {
    this.store.dispatch(
      setLossOfSkillSelectedTab({ selectedTab: selectedTab as LossOfSkillTab })
    );
  }

  triggerLoadWorkforce(jobKey: string): void {
    this.store.dispatch(loadLossOfSkillWorkforce({ jobKey }));
  }

  triggerLoadLeavers(jobKey: string): void {
    this.store.dispatch(loadLossOfSkillLeavers({ jobKey }));
  }
}
