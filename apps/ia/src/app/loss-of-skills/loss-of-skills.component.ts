import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { LostJobProfile } from './models';
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

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.lostJobProfilesLoading$ = this.store.select(getLostJobProfilesLoading);
    this.lostJobProfilesData$ = this.store.select(getLostJobProfilesData);
  }
}
