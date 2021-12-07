import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import {
  getIsLoggedIn,
  getProfileImage,
  getUsername,
} from '@schaeffler/azure-auth';

import packageJson from '../../package.json';
import { AppRoutePath } from './app-route-path.enum';
import {
  getHealthCheckAvailable,
  getHealthCheckLoading,
} from './core/store/selectors';

@Component({
  selector: 'gq-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Guided Quoting';
  titleLink = AppRoutePath.CaseViewPath;

  public appVersion = packageJson.version;
  public footerLinks: AppShellFooterLink[] = [
    {
      link: 'https://sconnect.schaeffler.com/groups/guided-quoting',
      title: 'GQ@SConnect',
      external: true,
    },
    {
      link: 'https://schaefflerprod.service-now.com/sup?id=sc_cat_item&sys_id=2d1e91cfdb5ba20038c2b6bffe961953&sysparm_category=19634e32dbb73e00d624b14ffe961977',
      title: 'GQ@ServiceNow',
      external: true,
    },
  ];

  profileImage$: Observable<string>;
  username$: Observable<string>;
  isLoggedIn$: Observable<boolean>;
  healthCheckLoading$: Observable<boolean>;
  isHealthCheckAvailable$: Observable<boolean>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);
    this.healthCheckLoading$ = this.store.select(getHealthCheckLoading);
    this.isHealthCheckAvailable$ = this.store.select(getHealthCheckAvailable);
  }
}
