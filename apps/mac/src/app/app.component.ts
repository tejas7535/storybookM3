import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { getProfileImage, getUsername } from '@schaeffler/azure-auth';
import { UserMenuEntry } from '@schaeffler/header';

import { RoutePath } from './app-routing.enum';
import { AppState } from './core/store/reducers';

@Component({
  selector: 'mac-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'Materials App Center';

  public username$: Observable<string>;
  public profileImage$: Observable<string>;

  userMenuEntries: UserMenuEntry[] = [];
  url: string;

  public constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.username$ = this.store.pipe(select(getUsername));
    this.profileImage$ = this.store.pipe(select(getProfileImage));
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.url = (event as NavigationEnd).url;
      });
  }

  get link(): string | boolean {
    return this.url && this.url !== `/${RoutePath.OverviewPath}`
      ? `/${RoutePath.OverviewPath}`
      : false;
  }
}
