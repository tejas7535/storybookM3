import { combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from './core/auth.service';
import { DataService } from './shared/result/data.service';

@Component({
  selector: 'sta-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Schaeffler Text Assistant';
  public username = 'User';
  public home = '/';

  public settingsSidebarOpen = false;
  public isInitialState$: Observable<boolean>;

  public subscription: Subscription = new Subscription();

  public sidebarElements = [
    {
      text: 'HOME',
      icon: 'icon-house',
      link: '/'
    },
    {
      text: 'Auto Tagging',
      icon: 'icon-bookmark',
      link: 'tagging'
    }
  ];

  public sidebarMode = 1;

  constructor(
    private readonly authService: AuthService,
    private readonly dataService: DataService
  ) {
    this.authService.initAuth();
  }

  public ngOnInit(): void {
    this.isInitialState$ = this.dataService.isInitialEmptyState();
    this.subscription.add(
      combineLatest([
        this.dataService.isInitialEmptyState(),
        this.dataService.isDataAvailable()
      ])
        .pipe(
          map(([isInitialState, isDataAvailable]) => {
            return isInitialState || isDataAvailable;
          })
        )
        .subscribe(open => (this.settingsSidebarOpen = open))
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Listen for changes in settings sidebar
   */
  public settingsSidebarOpenedChanges(open: boolean): void {
    this.settingsSidebarOpen = open;
  }
}
