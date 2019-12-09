import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  TRANSLOCO_CONFIG,
  TranslocoConfig,
  TranslocoModule,
  TranslocoService
} from '@ngneat/transloco';
import { PageNotFoundModule } from '@schaeffler/shared/empty-states';
import {
  BannerModule,
  FooterModule,
  HeaderModule,
  ScrollToTopModule,
  SettingsSidebarModule,
  SidebarModule,
  SnackBarComponent,
  SnackBarModule,
  SpeedDialFabModule
} from '@schaeffler/shared/ui-components';

import { AppRoutingModule } from './app-routing.module';
import { CustomBannerModule } from './shared/components/custom-banner/custom-banner.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { environment } from '../environments/environment';
import { StoreModule } from './core/store';
import { HammerConfig } from './shared/config';
import { translocoLoader } from './transloco.loader';

const translocoConfig: TranslocoConfig = {
  availableLangs: ['en'],
  defaultLang: 'en',
  prodMode: environment.production
};

const preloadLanguage = (transloco: TranslocoService) => () =>
  transloco.load(translocoConfig.defaultLang).toPromise();

const preLoad = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: preloadLanguage,
  deps: [TranslocoService]
};

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BannerModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslocoModule,
    MatButtonModule,
    FlexLayoutModule,
    FooterModule,
    ScrollToTopModule,
    SnackBarModule,
    HeaderModule,
    SidebarModule,
    PageNotFoundModule,
    StoreModule,
    SpeedDialFabModule,
    SettingsSidebarModule,
    CustomBannerModule
  ],
  entryComponents: [SnackBarComponent],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    },

    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig
    },
    translocoLoader,
    preLoad
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
