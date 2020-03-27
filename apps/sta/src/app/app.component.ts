import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';

import { Icon } from '@schaeffler/shared/icons';
import { BreakpointService } from '@schaeffler/shared/responsive';
import {
  FooterLink,
  SidebarElement,
  SidebarMode,
  SidebarService
} from '@schaeffler/shared/ui-components';

import { AuthService } from './core/auth.service';
import { ServiceType } from './shared/result/models';

@Component({
  selector: 'sta-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'STA - Schaeffler Text Assistant';
  public home = '/';
  public isHome = true;
  public isSidebarExpanded = false;
  public sidebarWidthExpanded = '960px';
  public sidebarWidthExpandedTablet = 'calc(100% - 60px)';
  public sidebarWidthExpandedMobile = '100%';
  public sidebarWidth = '400px';
  public triggerBtnIcon = new Icon('format_quote', true);
  public isLessThanMedium$: Observable<boolean>;
  public isMedium$: Observable<boolean>;
  public isMobile$: Observable<boolean>;
  public isAuthenticated$: Observable<boolean>;
  public isDoneLoading$: Observable<boolean>;
  public username$: Observable<string>;

  public settingsSidebarOpen = false;

  public currentService: ServiceType;

  public iconEnlarge = 'icon-resize-enlarge';
  public iconShrink = 'icon-resize-shrink';
  public resizeIcon = this.iconEnlarge;

  public readonly subscription: Subscription = new Subscription();
  public readonly destroy$: Subject<void> = new Subject();

  public sidebarElements: SidebarElement[] = [
    {
      text: 'Home',
      icon: new Icon('icon-house'),
      link: '/'
    },
    {
      text: 'Auto Tagging',
      icon: new Icon('local_offer', true),
      link: 'tagging'
    },
    {
      text: 'Translation',
      icon: new Icon('translate', true),
      link: 'translation'
    }
  ];
  public footerLinks: FooterLink[] = [
    {
      link: '/legal/data-privacy-en.html',
      title: 'Data Privacy',
      external: true
    },
    {
      link: '/legal/cookie-policy-en.html',
      title: 'Cookie Policy',
      external: true
    }
  ];

  private readonly sidebarToggled = new Subject<SidebarMode>();
  private readonly sidebarToggledObservable$ = this.sidebarToggled.asObservable();

  public mode: SidebarMode = SidebarMode.Open;

  constructor(
    private readonly authService: AuthService,
    private readonly sidebarService: SidebarService,
    private readonly breakpointService: BreakpointService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.authService.configureImplicitFlow();
  }

  public ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isDoneLoading$ = this.authService.isDoneLoading$;
    this.isMobile$ = this.breakpointService.isMobileViewPort();
    this.isLessThanMedium$ = this.breakpointService.isLessThanMedium();
    this.isMedium$ = this.breakpointService.isMedium();
    this.username$ = this.authService.getUserName();
    this.handleSidebarMode();

    this.subscription.add(
      this.sidebarToggledObservable$.subscribe((sidebarMode: SidebarMode) => {
        this.handleSidebarToggledObservable(sidebarMode);
      })
    );

    this.subscription.add(
      this.router.events
        .pipe(
          filter(evt => evt instanceof NavigationEnd),
          map(evt => evt as NavigationEnd),
          tap((routerEvent: NavigationEnd) => {
            this.isHome = routerEvent.url === this.home ? true : false;

            this.currentService = this.route.snapshot.firstChild.data.service;

            this.settingsSidebarOpen = !this.isHome;
          })
        )
        .subscribe()
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
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((sidebarMode: SidebarMode) => {
        this.sidebarToggled.next(sidebarMode);
      });
  }

  public resizeSidebar(): void {
    this.resizeIcon =
      this.resizeIcon === this.iconEnlarge ? this.iconShrink : this.iconEnlarge;
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  public closeSidebar(): void {
    this.settingsSidebarOpen = false;
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
