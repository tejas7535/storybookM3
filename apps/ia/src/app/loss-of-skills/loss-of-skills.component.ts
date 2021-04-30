import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { LostJobProfile } from '../shared/models';
import { LossOfSkillsState } from './store';
import {
  getLostJobProfilesData,
  getLostJobProfilesLoading,
} from './store/selectors/loss-of-skills.selector';

@Component({
  selector: 'ia-loss-of-skills',
  templateUrl: './loss-of-skills.component.html',
})
export class LossOfSkillsComponent implements OnInit {
  public lostJobProfilesLoading$: Observable<boolean>;
  public lostJobProfilesData$: Observable<LostJobProfile[]>;

  constructor(private readonly store: Store<LossOfSkillsState>) {}

  ngOnInit(): void {
    this.lostJobProfilesLoading$ = this.store.pipe(
      select(getLostJobProfilesLoading)
    );
    this.lostJobProfilesData$ = this.store.pipe(select(getLostJobProfilesData));
  }
}
