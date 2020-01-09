import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { SidebarMode, SidebarService } from '@schaeffler/shared/ui-components';

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

  public settingsSidebarOpen = true;
  public isDataAvl$: Observable<boolean>;

  public readonly subscription: Subscription = new Subscription();
  public readonly destroy$: Subject<void> = new Subject();

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

  private readonly sidebarToggled = new BehaviorSubject(undefined);
  private readonly sidebarToggledObservable$ = this.sidebarToggled.asObservable();

  public mode: SidebarMode = 2;

  constructor(
    private readonly authService: AuthService,
    private readonly dataStore: DataStoreService,
    private readonly sidebarService: SidebarService
  ) {
    this.authService.initAuth();
  }

  public ngOnInit(): void {
    this.isDataAvl$ = this.dataStore.isDataAvailable();
    this.handleSidebarMode();
    this.subscription.add(
      this.dataStore.isDataAvailable().subscribe(open => {
        if (open) {
          this.settingsSidebarOpen = true;
        }
      })
    );

    this.subscription.add(
      this.sidebarToggledObservable$.subscribe(sidebarMode =>
        this.handleSidebarToggledObservable(sidebarMode)
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
  }

  public settingsSidebarOpenedChanges(open: boolean): void {
    this.settingsSidebarOpen = open;
  }

  public toggleSidebar(): void {
    this.sidebarService
      .getSidebarMode()
      .pipe(
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(sidebarMode => {
        this.sidebarToggled.next(sidebarMode);
      });
  }

  private handleSidebarMode(): void {
    this.sidebarService
      .getSidebarMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sidebarMode => {
        this.mode = sidebarMode;
      });
  }

  private handleSidebarToggledObservable(sidebarMode: SidebarMode): void {
    if (sidebarMode === undefined) {
      return;
    }

    switch (this.mode) {
      case SidebarMode.Closed: {
        this.mode = SidebarMode.Open;
        break;
      }
      case SidebarMode.Minified: {
        this.mode = SidebarMode.Open;
        break;
      }
      case SidebarMode.Open: {
        this.mode =
          sidebarMode === SidebarMode.Open ||
          sidebarMode === SidebarMode.Minified
            ? SidebarMode.Minified
            : SidebarMode.Closed;
        break;
      }
      default:
        this.mode = this.mode;
    }
  }
}
