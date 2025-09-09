/* eslint-disable @nx/enforce-module-boundaries */
import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslocoService } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { BannerModule } from '@schaeffler/banner';
import {
  ADDITIONAL_THRID_PARTY_USAGE,
  PERSON_RESPONSIBLE,
  PURPOSE,
  STORAGE_PERIOD,
} from '@schaeffler/legal-pages';
import {
  DEFAULT_FONT,
  FONT_ASSET_PATH,
  LANGUAGE_FONT_MAPPINGS,
} from '@schaeffler/pdf-generator';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SettingsComponent } from './core/components/settings/settings.component';
import { CoreModule } from './core/core.module';
import { getMMAssetsPath } from './core/services/assets-path-resolver/assets-path-resolver.helper';
import { StoreModule } from './core/store/store.module';
import { HomeComponent } from './home/home.component';
import { responsiblePerson } from './shared/constants/legal-constants';

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

export function DynamicStoragePeriod(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.storagePeriod');
}

export function DynamicThirdPartyUsage(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.thirdPartyUsage');
}

export const APP_ROOT = 'mounting-manager';

const assetsPath = getMMAssetsPath();

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule,
    AppRoutingModule,
    CoreModule,
    AppShellModule,
    MatSidenavModule,
    MatIconModule,
    MatSlideToggleModule,
    PushPipe,
    BannerModule,
    SettingsComponent,
    HomeComponent,
  ],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
    },
    {
      provide: STORAGE_PERIOD,
      useFactory: DynamicStoragePeriod,
      deps: [TranslocoService],
    },
    {
      provide: ADDITIONAL_THRID_PARTY_USAGE,
      useFactory: DynamicThirdPartyUsage,
      deps: [TranslocoService],
    },
    {
      provide: FONT_ASSET_PATH,
      useValue: `${assetsPath}/fonts`,
    },
    {
      provide: DEFAULT_FONT,
      useValue: [
        {
          fontName: 'Noto',
          fontStyle: 'normal',
          fileName: 'NotoSans-Regular.ttf',
        },
        {
          fontName: 'Noto',
          fontStyle: 'bold',
          fileName: 'NotoSans-Bold.ttf',
        },
      ],
    },
    {
      provide: LANGUAGE_FONT_MAPPINGS,
      useValue: {
        zh: [
          {
            fontName: 'Noto',
            fontStyle: 'normal',
            fileName: 'NotoSansSC-Regular.ttf',
          },
          {
            fontName: 'Noto',
            fontStyle: 'bold',
            fileName: 'NotoSansSC-Bold.ttf',
          },
        ],
      },
    },
  ],
})
export class AppModule implements DoBootstrap {
  constructor(readonly injector: Injector) {
    // check if app is already initialized. It should prevent from intialization called multiple times
    if (!customElements.get(APP_ROOT)) {
      const webComponent = createCustomElement(AppComponent, { injector });
      customElements.define(APP_ROOT, webComponent);
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngDoBootstrap(_appRef: ApplicationRef) {
    // this function is required by Angular but not actually necessary since we create a web component here
  }
}
