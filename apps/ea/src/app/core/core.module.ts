import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from '@ea/environments/environment';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from '@ea/shared/constants/language';
import { provideTranslocoPersistLang } from '@jsverse/transloco-persist-lang';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HttpBearinxInterceptor } from './interceptor/http-bearinx.interceptor';
import { HttpCatalogWebApiInterceptor } from './interceptor/http-catalog-web-api.interceptor';
import { HttpCO2UpstreamInterceptor } from './interceptor/http-co2-upstream.interceptor';
import { StoreModule } from './store/store.module';

@NgModule({
  exports: [StoreModule, SharedTranslocoModule],
  imports: [
    StoreModule,
    SharedTranslocoModule.forRoot(
      environment.production,
      AVAILABLE_LANGUAGES,
      undefined, // default -> undefined would lead to browser detection
      FALLBACK_LANGUAGE.id,
      LANGUAGE_STORAGE_KEY,
      true,
      !environment.localDev,
      undefined,
      `${environment.assetsPath}/i18n/`
    ),
  ],
  providers: [
    provideTranslocoPersistLang({
      storageKey: LANGUAGE_STORAGE_KEY,
      storage: {
        useValue: localStorage,
      },
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpBearinxInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCatalogWebApiInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCO2UpstreamInterceptor,
      multi: true,
    },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
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
      co2: 'icon_CO2.svg',
      airwaves: 'icon_airwaves.svg',
      air: 'icon_air.svg',
      acute: 'icon_acute.svg',
      bolt: 'icon_bolt.svg',
      device_thermostat: 'icon_device_thermostat.svg',
      mop: 'icon_mop.svg',
      calculation: 'icon_calculations.svg',
      friction_load: 'icon_load_frictional_powerloss.svg',
      lubrication_parameters: 'icon_lubrication_parameters.svg',
      rating_life: 'icon_rpm_rating_life.svg',
      water_drop: 'icon_water_drop.svg',
      grease_app: 'icon_grease_app.svg',
      mounting_manager: 'icon_mounting_manager.svg',
    };
    for (const [name, url] of Object.entries(iconSet)) {
      const setUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${environment.assetsPath}/icons/${url}`
      );
      this.matIconRegistry.addSvgIcon(name, setUrl);
    }
  }
}
