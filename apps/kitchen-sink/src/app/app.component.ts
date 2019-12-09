import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';
import {
  SidebarElement,
  SidebarMode,
  SidebarService,
  UserMenuEntry
} from '@schaeffler/shared/ui-components';

import {
  AppState,
  getSidebarMode,
  setSidebarMode,
  toggleSidebar
} from './core/store';

@Component({
  selector: 'schaeffler-frontend-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public username = 'Test User';
  public userMenuEntries = [
    new UserMenuEntry('logout', translate('GENERAL.LOGOUT'))
  ];

  public platformTitle = translate('GENERAL.APP_NAME');

  public sidebarElements: SidebarElement[] = [
    {
      text: 'NAVIGATION.HOME',
      icon: 'icon-house',
      link: '/home'
    },
    {
      text: 'NAVIGATION.NOT_FOUND',
      icon: 'icon-house',
      link: '/second'
    }
  ];

  public sidebarMode: Observable<SidebarMode>;
  public bannerOpen: Observable<boolean>;

  public settingsSidebarOpen = false;

  constructor(
    private readonly store: Store<AppState>,
    private readonly sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.sidebarMode = this.store.pipe(select(getSidebarMode));

    this.handleSidebarMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  /**
   * User Menu Entry Clicked.
   */
  public userMenuClicked(key: string): void {
    console.log(`You clicked the following the menu entry: ${key}`);
  }

  public onChangeSettingsSidebar(open: boolean): void {
    console.log(open);
  }

  /**
   * Change sidebarState by breakpointService
   */
  public toggleSidebar(): void {
    this.sidebarService
      .getSidebarMode()
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(sidebarMode => {
        this.store.dispatch(toggleSidebar({ sidebarMode }));
      });
  }

  private handleSidebarMode(): void {
    this.sidebarService
      .getSidebarMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sidebarMode => {
        this.store.dispatch(setSidebarMode({ sidebarMode }));
      });
  }
}
