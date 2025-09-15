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
import { NavigationEnd, NavigationSkipped, Router } from '@angular/router';

import {
  combineLatest,
  filter,
  map,
  startWith,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import {
  EaDeliveryService,
  EaEmbeddedRootComponent,
} from '@schaeffler/engineering-apps-behaviors/utils';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import packageJson from '../../package.json';
import { MMSeparator } from './core/services';
import { OneTrustMobileService } from './core/services/tracking/one-trust-mobile.service';
import { CalculationSelectionFacade } from './core/store/facades/calculation-selection/calculation-selection.facade';
import { GlobalFacade } from './core/store/facades/global/global.facade';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mounting-manager',
  templateUrl: './app.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent
  extends EaEmbeddedRootComponent
  implements OnInit, OnDestroy
{
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly oneTrustMobileService = inject(OneTrustMobileService);
  private readonly globalFacade = inject(GlobalFacade);
  private readonly calculationSelectionFacade = inject(
    CalculationSelectionFacade
  );
  private readonly deliveryService = inject(EaDeliveryService);

  public title = 'Mounting Manager';
  public appVersion = packageJson.version;

  public separator = input<MMSeparator>();
  public outsidemedias = input<boolean>();

  public isCookiePage = false;
  public cookieSettings = this.translocoService.translate(
    'legal.cookieSettings'
  );

  public isBannerOpened = toSignal(this.globalFacade.isBannerOpened$);
  public isStandalone = this.embeddedService.isStandalone;
  public isMobile = this.deliveryService.isMobile;

  public isInitialized$ = this.globalFacade.isInitialized$;
  public destroy$ = new Subject<void>();

  public footerLinks$ = combineLatest([
    this.translocoService.selectTranslate('legal.imprint').pipe(
      map((title) => ({
        link: `${LegalRoute}/${LegalPath.ImprintPath}`,
        title,
        external: false,
      }))
    ),
    this.translocoService.selectTranslate('legal.dataPrivacy').pipe(
      map((title) => ({
        link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
        title,
        external: false,
      }))
    ),
    this.translocoService.selectTranslate('legal.termsOfUse').pipe(
      map((title) => ({
        link: `${LegalRoute}/${LegalPath.TermsPath}`,
        title,
        external: false,
      }))
    ),
    this.translocoService.selectTranslate('legal.cookiePolicy').pipe(
      map((title) => ({
        link: `${LegalRoute}/${LegalPath.CookiePath}`,
        title,
        external: false,
      })),
      filter(() => !this.isMobile()),
      // eslint-disable-next-line unicorn/no-useless-undefined
      startWith(undefined)
    ),
    this.translocoService.selectTranslate('legal.cookiePolicy').pipe(
      map(
        (title) =>
          ({
            link: 'wrong link',
            title,
            external: false,
            onClick: ($event: MouseEvent) => {
              $event.preventDefault();
              this.oneTrustMobileService.showPreferenceCenterUI();
            },
          }) as AppShellFooterLink
      ),
      filter(() => this.isMobile()),
      // eslint-disable-next-line unicorn/no-useless-undefined
      startWith(undefined)
    ),
  ]).pipe(
    map((links) => links.filter(Boolean)) // Filter out any null values
  );

  public readonly metaTags$ = combineLatest([
    this.translocoService.selectTranslate('meta.title'),
    this.translocoService.selectTranslate('meta.description'),
  ]).pipe(map(([title, description]) => this.makeMetaTags(title, description)));

  public ngOnInit(): void {
    if (this.isStandalone()) {
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          take(1)
        )
        .subscribe(() => {
          this.globalFacade.initGlobal(this.bearing(), this.separator());
        });
      this.metaTags$.subscribe((tags) => this.meta.addTags(tags));
    } else {
      this.globalFacade.initGlobal(this.bearing(), this.separator());
    }

    window.history.replaceState({ step: 0 }, '', window.location.href);
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationSkipped)
      )
      .subscribe(() => {
        const { step } = history.state;
        if (step !== undefined) {
          this.calculationSelectionFacade.setCurrentStep(step, true);
        }
      });

    if (
      !this.router.getCurrentNavigation() &&
      !this.router.lastSuccessfulNavigation &&
      this.isStandalone()
    ) {
      this.router.initialNavigation();
    }
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private makeMetaTags(title: string, description: string): MetaDefinition[] {
    const tagFactory = (
      fprefix: string,
      ftitle: string,
      fdescription: string
    ) => [
      { name: `${fprefix + (fprefix === '' ? '' : ':')}title`, value: ftitle },
      {
        name: `${fprefix + (fprefix === '' ? '' : ':')}description`,
        value: fdescription,
      },
    ];
    const prefixes = ['og', 'twitter', ''];

    return prefixes.flatMap((prefix) => tagFactory(prefix, title, description));
  }
}
