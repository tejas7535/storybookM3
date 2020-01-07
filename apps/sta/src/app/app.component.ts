import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from './core/auth.service';
import { DataStoreService } from './shared/result/services/data-store.service';

@Component({
  selector: 'sta-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Schaeffler Text Assistant';
  public username = 'User';
  public home = '/';

  public settingsSidebarOpen = false;
  public isDataAvl$: Observable<boolean>;

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
    },
    {
      text: 'Translation',
      icon: 'icon-bookmark',
      link: 'translation'
    }
  ];

  public sidebarMode = 1;

  constructor(
    private readonly authService: AuthService,
    private readonly dataStore: DataStoreService
  ) {
    this.authService.initAuth();
  }

  public ngOnInit(): void {
    this.isDataAvl$ = this.dataStore.isDataAvailable();
    this.subscription.add(
      this.dataStore
        .isDataAvailable()
        .pipe(
          filter((_val, idx) => {
            if (idx === 0) {
              this.settingsSidebarOpen = true;

              return false;
            }

            return true;
          })
        )
        .subscribe(open => (this.settingsSidebarOpen = open))
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public settingsSidebarOpenedChanges(open: boolean): void {
    this.settingsSidebarOpen = open;
  }
}
