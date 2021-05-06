import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';
import { UserMenuEntry } from '@schaeffler/header';

import { AppRoutePath } from './app-route-path.enum';
import { AppState } from './core/store/reducers';

interface TabElem {
  label: string;
  path: string;
  disabled: boolean;
}
@Component({
  selector: 'ia-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Insight Attrition';

  username$: Observable<string>;
  profileImage$: Observable<string>;
  userMenuEntries: UserMenuEntry[] = [];
  getIsLoggedIn$: Observable<boolean>;

  public tabs: TabElem[] = [
    {
      label: 'overview',
      path: AppRoutePath.OverviewPath,
      disabled: false,
    },
    {
      label: 'organizationalView',
      path: AppRoutePath.OrganizationalView,
      disabled: false,
    },
    {
      label: 'lossOfSkill',
      path: AppRoutePath.LossOfSkillPath,
      disabled: true,
    },
    {
      label: 'reasonsAndCounterMeasures',
      path: AppRoutePath.ReasonsPath,
      disabled: true,
    },
    {
      label: 'attritionAnalytics',
      path: AppRoutePath.AnalyticsPath,
      disabled: true,
    },
  ];

  public constructor(private readonly store: Store<AppState>) {}

  public ngOnInit(): void {
    this.username$ = this.store.pipe(select(getUsername));
    this.profileImage$ = this.store.pipe(select(getProfileImage));
    this.getIsLoggedIn$ = this.store.pipe(select(getIsLoggedIn));
  }

  public trackByFn(index: number): number {
    return index;
  }
}
