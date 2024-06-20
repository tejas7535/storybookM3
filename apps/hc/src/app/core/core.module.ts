import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { environment } from '@hc/environments/environment';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';

import {
  ApplicationInsightsModule,
  ApplicationInsightsService,
  COOKIE_GROUPS,
  CustomProps,
} from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from '../constants';

@NgModule({
  exports: [SharedTranslocoModule],
  imports: [
    // Material Modules
    MatSnackBarModule,
    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      AVAILABLE_LANGUAGES,
      'en', // default -> undefined would lead to browser detection
      FALLBACK_LANGUAGE.id,
      LANGUAGE_STORAGE_KEY,
      true,
      !environment.localDev
    ),
    OneTrustModule.forRoot({
      cookiesGroups: COOKIE_GROUPS,
      domainScript: environment.oneTrustId,
    }),
    ApplicationInsightsModule.forRoot(environment.applicationInsights),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [ApplicationInsightsService, OneTrustService],
      useFactory: (
        appInsightService: ApplicationInsightsService,
        oneTrustService: OneTrustService
      ) => {
        const customProps: CustomProps = {
          tag: 'application',
          value: '[Hardness - Converter]',
        };
        appInsightService.initTracking(
          oneTrustService.consentChanged$(),
          customProps
        );

        return () => oneTrustService.loadOneTrust();
      },
      multi: true,
    },
    provideTranslocoPersistLang({
      storageKey: LANGUAGE_STORAGE_KEY,
      storage: {
        useValue: localStorage,
      },
    }),
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class CoreModule {
  public constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {
    this.registerEAIcons();
  }

  public registerEAIcons(): void {
    const iconSet: Record<string, string> = {
      hardness_converter: 'hardness_converter.svg',
    };
    for (const [name, url] of Object.entries(iconSet)) {
      const setUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `/assets/icons/${url}`
      );
      this.matIconRegistry.addSvgIcon(name, setUrl);
    }
  }
}
