import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { ExitEntryEmployeesResponse } from '../overview/models';
import { JobProfile } from './models';
import {
  loadLossOfSkillLeavers,
  loadLossOfSkillWorkforce,
} from './store/actions/loss-of-skill.actions';
import {
  getLossOfSkillLeaversData,
  getLossOfSkillLeaversLoading,
  getLossOfSkillWorkforceData,
  getLossOfSkillWorkforceLoading,
  getLostJobProfilesData,
  getLostJobProfilesLoading,
} from './store/selectors/loss-of-skill.selector';

@Component({
  selector: 'ia-loss-of-skill',
  templateUrl: './loss-of-skill.component.html',
})
export class LossOfSkillComponent implements OnInit {
  lostJobProfilesLoading$: Observable<boolean>;
  lostJobProfilesData$: Observable<(JobProfile & { openPositions: number })[]>;
  lossOfSkillWorkforceData$: Observable<ExitEntryEmployeesResponse>;
  lossOfSkillWorkforceLoading$: Observable<boolean>;
  lossOfSkillLeaversData$: Observable<ExitEntryEmployeesResponse>;
  lossOfSkillLeaversLoading$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.lostJobProfilesLoading$ = this.store.select(getLostJobProfilesLoading);
    this.lostJobProfilesData$ = this.store.select(getLostJobProfilesData);
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
