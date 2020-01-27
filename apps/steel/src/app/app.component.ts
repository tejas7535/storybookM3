import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { BreakpointService } from '@schaeffler/shared/responsive';
import {
  SidebarElement,
  SidebarMode,
  SidebarService
} from '@schaeffler/shared/ui-components';

@Component({
  selector: 'schaeffler-steel-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  public isSidebarExpanded = false;
  public sidebarWidthExpanded = '960px';
  public sidebarWidthExpandedTablet = 'calc(100% - 60px)';
  public sidebarWidthExpandedMobile = '100%';
  public sidebarWidth = '400px';
  public isLessThanMedium$: Observable<boolean>;
  public isMedium$: Observable<boolean>;
  public isMobile$: Observable<boolean>;

  public platformTitle = translate('GENERAL.APP_NAME');

  public readonly subscription: Subscription = new Subscription();
  public readonly destroy$: Subject<void> = new Subject();

  public sidebarElements: SidebarElement[] = [
    {
      text: translate('NAVIGATION.HOME'),
      icon: 'icon-house',
      link: '/home'
    }
  ];

  private readonly sidebarToggled = new BehaviorSubject(undefined);
  private readonly sidebarToggledObservable$ = this.sidebarToggled.asObservable();

  public mode: SidebarMode = SidebarMode.Minified;

  constructor(
    private readonly sidebarService: SidebarService,
    private readonly breakpointService: BreakpointService
  ) {}

  public ngOnInit(): void {
    this.isMobile$ = this.breakpointService.isMobileViewPort();
    this.isLessThanMedium$ = this.breakpointService.isLessThanMedium();
    this.isMedium$ = this.breakpointService.isMedium();
    this.handleSidebarMode();

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
