/* eslint-disable @nx/enforce-module-boundaries */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import {
  BehaviorSubject,
  filter,
  merge,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';

import {
  LoadedEvent,
  TranslocoEvents,
  TranslocoService,
} from '@jsverse/transloco';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import packageJson from '../../package.json';
import { MMSeparator } from './core/services';
import { OneTrustMobileService } from './core/services/tracking/one-trust-mobile.service';
import { GlobalFacade } from './core/store/facades/global/global.facade';
import { AppDelivery } from './shared/models';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mounting-manager',
  templateUrl: './app.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly translocoService = inject(TranslocoService);
  private readonly oneTrustMobileService = inject(OneTrustMobileService);
  private readonly globalFacade = inject(GlobalFacade);

  public title = 'Mounting Manager';
  public appVersion = packageJson.version;

  public standalone = input<boolean>();
  public bearing = input<string>();
  public separator = input<MMSeparator>();
  public language = input<string>();

  public isCookiePage = false;
  public cookieSettings = this.translocoService.translate(
    'legal.cookieSettings'
  );

  public isBannerOpened = toSignal(this.globalFacade.isBannerOpened$);
  public isStandalone = toSignal(this.globalFacade.isStandalone$);

  public appDelivery$ = this.globalFacade.appDelivery$;

  public isInitialized$ = this.globalFacade.isInitialized$;
  public destroy$ = new Subject<void>();

  public footerLinks$ = new BehaviorSubject<AppShellFooterLink[]>([]);

  public metaTags: MetaDefinition[] = [
    { name: 'title', content: this.translocoService.translate('meta.title') },
    {
      name: 'description',
      content: this.translocoService.translate('meta.description'),
    },
    // Open Graph / Facebook
    {
      name: 'og:title',
      content: this.translocoService.translate('meta.title'),
    },
    {
      name: 'og:description',
      content: this.translocoService.translate('meta.description'),
    },
    // Twitter
    {
      name: 'twitter:title',
      content: this.translocoService.translate('meta.title'),
    },
    {
      name: 'twitter:description',
      content: this.translocoService.translate('meta.description'),
    },
  ];

  public ngOnInit(): void {
    this.meta.addTags(this.metaTags);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        this.globalFacade.initGlobal(
          this.standalone(),
          this.bearing(),
          this.separator(),
          this.language()
        );
      });

    this.isInitialized$
      .pipe(
        filter((isInitialized) => isInitialized),
        switchMap(() =>
          merge([
            this.appDelivery$,
            this.translocoService.events$.pipe(
              filter(
                (event: TranslocoEvents) =>
                  !(event as LoadedEvent).wasFailure &&
                  event.type === 'translationLoadSuccess'
              )
            ),
            this.translocoService.langChanges$,
          ])
        ),
        switchMap(() => this.appDelivery$)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((appDelivery) => {
        this.footerLinks$.next(this.getFooterLinks(appDelivery));
      });

    if (
      !this.router.getCurrentNavigation() &&
      !this.router.lastSuccessfulNavigation
    ) {
      this.router.initialNavigation();
    }
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getFooterLinks(appDelivery: AppDelivery): AppShellFooterLink[] {
    const footerLinks: AppShellFooterLink[] = [
      {
        link: `${LegalRoute}/${LegalPath.ImprintPath}`,
        title: this.translocoService.translate('legal.imprint'),
        external: false,
      },
      {
        link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
        title: this.translocoService.translate('legal.dataPrivacy'),
        external: false,
      },
      {
        link: `${LegalRoute}/${LegalPath.TermsPath}`,
        title: this.translocoService.translate('legal.termsOfUse'),
        external: false,
      },
    ];

    return [
      ...footerLinks,
      appDelivery === AppDelivery.Native
        ? {
            link: undefined,
            title: this.translocoService.translate('legal.cookiePolicy'),
            external: false,
            onClick: ($event: MouseEvent) => {
              $event.preventDefault();
              this.oneTrustMobileService.showPreferenceCenterUI();
            },
          }
        : {
            link: `${LegalRoute}/${LegalPath.CookiePath}`,
            title: this.translocoService.translate('legal.cookiePolicy'),
            external: false,
          },
    ];
  }
}
