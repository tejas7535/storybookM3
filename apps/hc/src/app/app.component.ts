import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';

import {
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import packageJson from '../../package.json';
import { AuthService } from './services/auth.service';
import { InternalUserCheckService } from './services/internal-user-check.service';

@Component({
  selector: 'hc-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public appTitle = 'Hardness Converter';
  public readonly appVersion = packageJson.version;
  public isCookiePage = false;
  public footerLinks$: Observable<AppShellFooterLink[]>;
  public loginChecked = false;

  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoService: TranslocoService =
    inject(TranslocoService);
  private readonly router: Router = inject(Router);

  constructor(
    public readonly authService: AuthService,
    private readonly internalDetection: InternalUserCheckService
  ) {}

  ngOnInit(): void {
    this.footerLinks$ = combineLatest([
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
        }))
      ),
    ]);

    this.internalDetection
      .isInternalUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((internal) =>
          internal
            ? this.authService.isLoggedin().pipe(map((val) => !val))
            : of(false)
        ),
        debounceTime(500),
        tap((shouldLogin) =>
          shouldLogin ? this.authService.login() : undefined
        )
      )
      .subscribe(() => {
        this.loginChecked = true;
      });

    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        const url = (event as NavigationEnd).url?.split('/').pop();

        this.isCookiePage = url === LegalPath.CookiePath;
      });
  }
}
