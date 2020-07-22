import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { FooterLink } from '@schaeffler/footer';
import { Icon } from '@schaeffler/icons';
import { BreakpointService } from '@schaeffler/responsive';
import {
  getIsLoggedIn,
  getUsername,
  startLoginFlow,
} from '@schaeffler/shared/auth';
import { SidebarElement } from '@schaeffler/sidebar';

import { AppState } from './core/store';
import { ServiceType } from './shared/result/models';

@Component({
  selector: 'sta-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'STA - Schaeffler Text Assistant';
  public home = '/';
  public translationRoute = '/translation';
  public isHome = true;
  public isSidebarExpanded = false;
  public sidebarWidthExpanded = '960px';
  public sidebarWidthExpandedTablet = 'calc(100% - 60px)';
  public sidebarWidthExpandedMobile = '100%';
  public sidebarWidth = '400px';
  public triggerBtnIcon = new Icon('format_quote', true);
  public isLessThanMedium$: Observable<boolean>;
  public isMedium$: Observable<boolean>;
  public isDesktop$: Observable<boolean>;
  public isDesktop: boolean;
  public isMobile$: Observable<boolean>;
  public isMobile: boolean;
  public isAuthenticated$: Observable<boolean>;
  public username$: Observable<string>;
  public settingsSidebarOpen = false;
  public currentRoute: string;
  public alreadyVisited: string;
  public currentService: ServiceType;

  public iconEnlarge = 'icon-resize-enlarge';
  public iconShrink = 'icon-resize-shrink';
  public resizeIcon = this.iconEnlarge;

  public readonly subscription: Subscription = new Subscription();

  public sidebarElements: SidebarElement[] = [
    {
      text: 'Home',
      icon: new Icon('icon-house'),
      link: '/',
    },
    {
      text: 'Auto Tagging',
      icon: new Icon('local_offer', true),
      link: 'tagging',
    },
    {
      text: 'Translation',
      icon: new Icon('translate', true),
      link: 'translation',
    },
    {
      text: 'Question Answering',
      icon: new Icon('question_answer', true),
      link: 'question-answering',
    },
  ];
  public footerLinks: FooterLink[] = [
    {
      link: '/legal/data-privacy-en.html',
      title: 'Data Privacy',
      external: true,
    },
    {
      link: '/legal/cookie-policy-en.html',
      title: 'Cookie Policy',
      external: true,
    },
  ];

  constructor(
    private readonly breakpointService: BreakpointService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.alreadyVisited = localStorage.getItem('alreadyVisited');
    this.isAuthenticated$ = this.store.pipe(select(getIsLoggedIn));
    this.isMobile$ = this.breakpointService.isMobileViewPort();
    this.isLessThanMedium$ = this.breakpointService.isLessThanMedium();
    this.isMedium$ = this.breakpointService.isMedium();
    this.username$ = this.store.pipe(select(getUsername));
    this.isDesktop$ = this.breakpointService.isDesktop();
    this.addSubscriptions();

    if (this.alreadyVisited) {
      this.store.dispatch(startLoginFlow());
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public addSubscriptions(): void {
    this.subscription.add(
      this.router.events
        .pipe(
          filter((evt) => evt instanceof NavigationEnd),
          map((evt) => evt as NavigationEnd),
          tap((routerEvent: NavigationEnd) => {
            this.isHome = routerEvent.url === this.home ? true : false;
            this.currentService = this.route.snapshot.firstChild.data.service;

            this.currentRoute = routerEvent.url;
            this.isSidebarExpanded =
              this.currentRoute === this.translationRoute && this.isDesktop;

            this.settingsSidebarOpen = this.isHome ? false : !this.isMobile;
          })
        )
        .subscribe()
    );
    this.subscription.add(
      this.isDesktop$.subscribe((isDesktopValue: boolean) => {
        this.isDesktop = isDesktopValue;
        this.isSidebarExpanded =
          this.currentRoute === this.translationRoute && isDesktopValue;
      })
    );

    this.subscription.add(
      this.isMobile$.subscribe((isMobileValue: boolean) => {
        this.isMobile = isMobileValue;
        if (!this.isHome) {
          this.settingsSidebarOpenedChanges(!isMobileValue);
        }
      })
    );
  }

  public settingsSidebarOpenedChanges(open: boolean): void {
    this.settingsSidebarOpen = open;
  }

  public resizeSidebar(): void {
    this.resizeIcon =
      this.resizeIcon === this.iconEnlarge ? this.iconShrink : this.iconEnlarge;
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  public closeSidebar(): void {
    this.settingsSidebarOpen = false;
  }
}
