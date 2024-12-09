import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';

import { BannerModule } from '@schaeffler/banner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppComponent } from './app.component';
import { AppOverlayContainer } from './app-overlay.container';
import { CoreModule } from './core/core.module';
import { LsaAppService } from './core/services/lsa-app.service';
import { StaticStorageService } from './core/services/static-storage';
import { RecommendationContainerComponent } from './recommendation/recommendation-container.component';
import { FeedbackBannerComponent } from '@schaeffler/feedback-banner';

export const APP_ROOT = 'lubricator-selection-assistant';

@NgModule({
  declarations: [AppComponent],
  providers: [
    { provide: OverlayContainer, useClass: AppOverlayContainer },
    LsaAppService,
    StaticStorageService,
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
