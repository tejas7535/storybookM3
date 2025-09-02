import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '@lsa/environments/environment';
import { StoreModule } from '@ngrx/store';

import { BannerModule } from '@schaeffler/banner';
import { FeedbackBannerComponent } from '@schaeffler/feedback-banner';
import {
  DEFAULT_FONT,
  FONT_ASSET_PATH,
  LANGUAGE_FONT_MAPPINGS,
} from '@schaeffler/pdf-generator';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppComponent } from './app.component';
import { AppOverlayContainer } from './app-overlay.container';
import { CoreModule } from './core/core.module';
import { LsaAppService } from './core/services/lsa-app.service';
import { StaticStorageService } from './core/services/static-storage';
import { RecommendationContainerComponent } from './recommendation/recommendation-container.component';
import { LSALanguageInterceptor } from './shared/interceptors/language.interceptor';
export const APP_ROOT = 'lubricator-selection-assistant';

@NgModule({
  declarations: [AppComponent],
  providers: [
    { provide: OverlayContainer, useClass: AppOverlayContainer },
    LsaAppService,
    StaticStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LSALanguageInterceptor,
      multi: true,
    },
    {
      provide: FONT_ASSET_PATH,
      useValue: `${environment.assetsPath}/fonts`,
    },
    {
      provide: DEFAULT_FONT,
      useValue: [
        {
          fontName: 'Noto',
          fontStyle: 'normal',
          fileName: 'EASans-Regular.ttf',
        },
        {
          fontName: 'Noto',
          fontStyle: 'bold',
          fileName: 'EASans-Bold.ttf',
        },
      ],
    },
    {
      provide: LANGUAGE_FONT_MAPPINGS,
      useValue: {
        ja: [
          {
            fontName: 'Noto',
            fontStyle: 'normal',
            fileName: 'EASansJP-Regular.ttf',
          },
          {
            fontName: 'Noto',
            fontStyle: 'bold',
            fileName: 'EASansJP-Bold.ttf',
          },
        ],
        ko: [
          {
            fontName: 'Noto',
            fontStyle: 'normal',
            fileName: 'EASansKR-Regular.ttf',
          },
          {
            fontName: 'Noto',
            fontStyle: 'bold',
            fileName: 'NotoSansKR-Bold.ttf',
          },
        ],
        zh: [
          {
            fontName: 'Noto',
            fontStyle: 'normal',
            fileName: 'EASansSC-Regular.ttf',
          },
          {
            fontName: 'Noto',
            fontStyle: 'bold',
            fileName: 'EASansSC-Bold.ttf',
          },
        ],
        zh_TW: [
          {
            fontName: 'Noto',
            fontStyle: 'normal',
            fileName: 'EASansTC-Regular.ttf',
          },
          {
            fontName: 'Noto',
            fontStyle: 'bold',
            fileName: 'EASansTC-Bold.ttf',
          },
        ],
      },
    },
  ],
  imports: [
    StoreModule.forRoot({}),
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedTranslocoModule,
    MatDividerModule,
    CommonModule,
    RecommendationContainerComponent,
    BannerModule,
    FeedbackBannerComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
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
  ngDoBootstrap(_appRef: ApplicationRef): void {
    // this function is required by Angular but not actually necessary since we create a web component here
  }
}
