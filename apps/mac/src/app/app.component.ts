import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { getUsername, startLoginFlow } from '@schaeffler/auth';
import { UserMenuEntry } from '@schaeffler/header';

import { RoutePath } from './app-routing.enum';
import { AppState } from './core/store/reducers';

@Component({
  selector: 'mac-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Materials App Center';

  username$: Observable<string>;
  userMenuEntries: UserMenuEntry[] = [];
  url: string;

  public constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.username$ = this.store.pipe(select(getUsername));
    this.store.dispatch(startLoginFlow());
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.url = (event as NavigationEnd).url;
      });
  }

  get link(): string {
    return (
      this.url === `/${RoutePath.HardnessConverterPath}` &&
      `/${RoutePath.OverviewPath}`
    );
  }
}
