import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';
import { UserMenuEntry } from '@schaeffler/header';

import { AppRoutePath } from './app-route-path.enum';

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
      disabled: false,
    },
    {
      label: 'reasonsAndCounterMeasures',
      path: AppRoutePath.ReasonsAndCounterMeasuresPath,
      disabled: false,
    },
    {
      label: 'attritionAnalytics',
      path: AppRoutePath.AttritionAnalyticsPath,
      disabled: false,
    },
  ];

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.getIsLoggedIn$ = this.store.select(getIsLoggedIn);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
