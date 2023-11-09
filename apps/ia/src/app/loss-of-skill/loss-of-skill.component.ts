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
import { JobProfile, WorkforceResponse } from './models';
import {
  loadLossOfSkillLeavers,
  loadLossOfSkillWorkforce,
} from './store/actions/loss-of-skill.actions';
import {
  getJobProfilesData,
  getJobProfilesLoading,
  getLossOfSkillLeaversData,
  getLossOfSkillLeaversLoading,
  getLossOfSkillWorkforceData,
  getLossOfSkillWorkforceLoading,
} from './store/selectors/loss-of-skill.selector';

@Component({
  selector: 'ia-loss-of-skill',
  templateUrl: './loss-of-skill.component.html',
})
export class LossOfSkillComponent implements OnInit {
  beautifiedFilters$: Observable<EmployeeListDialogMetaFilters>;
  timeRange$: Observable<IdValue>;
  areOpenPositionsAvailable$: Observable<boolean>;
  lostJobProfilesLoading$: Observable<boolean>;
  lostJobProfilesData$: Observable<JobProfile[]>;
  lossOfSkillWorkforceData$: Observable<WorkforceResponse>;
  lossOfSkillWorkforceLoading$: Observable<boolean>;
  lossOfSkillLeaversData$: Observable<ExitEntryEmployeesResponse>;
  lossOfSkillLeaversLoading$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
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
  }

  triggerLoadWorkforce(positionDescription: string): void {
    this.store.dispatch(loadLossOfSkillWorkforce({ positionDescription }));
  }

  triggerLoadLeavers(positionDescription: string): void {
    this.store.dispatch(loadLossOfSkillLeavers({ positionDescription }));
  }
}
