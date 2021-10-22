import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { getProfileImage, getUsername } from '@schaeffler/azure-auth';
import { UserMenuEntry } from '@schaeffler/header';

import { RoutePath } from './app-routing.enum';

@Component({
  selector: 'mac-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public title = 'Materials App Center';

  public username$: Observable<string>;
  public profileImage$: Observable<string>;

  userMenuEntries: UserMenuEntry[] = [];
  url: string;

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.applicationInsightService.logEvent('[MAC - NAVIGATION]', {
          url: (event as NavigationEnd).url,
          urlAfterRedirects: (event as NavigationEnd).urlAfterRedirects,
        });
        this.url = (event as NavigationEnd).url;
      });
  }

  public get link(): string | boolean {
    return this.url && this.url !== `/${RoutePath.OverviewPath}`
      ? `/${RoutePath.OverviewPath}`
      : false;
  }
}
