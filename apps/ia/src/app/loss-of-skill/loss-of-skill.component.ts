import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { JobProfile } from './models';
import {
  getLostJobProfilesData,
  getLostJobProfilesLoading,
} from './store/selectors/loss-of-skill.selector';

@Component({
  selector: 'ia-loss-of-skill',
  templateUrl: './loss-of-skill.component.html',
})
export class LossOfSkillComponent implements OnInit {
  public lostJobProfilesLoading$: Observable<boolean>;
  public lostJobProfilesData$: Observable<
    (JobProfile & { openPositions: number })[]
  >;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.lostJobProfilesLoading$ = this.store.select(getLostJobProfilesLoading);
    this.lostJobProfilesData$ = this.store.select(getLostJobProfilesData);
  }
}
