import { OverlayContainer } from '@angular/cdk/overlay';
import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { TranslocoService } from '@ngneat/transloco';
import { TranslocoDecimalPipe } from '@ngneat/transloco-locale';
import { PushPipe } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { BannerModule } from '@schaeffler/banner';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  PERSON_RESPONSIBLE,
  PURPOSE,
  STORAGE_PERIOD,
  TERMS_OF_USE,
} from '@schaeffler/legal-pages';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { LanguageSelectModule } from '@schaeffler/transloco/components';

import { AppComponent } from './app.component';
import { AppOverlayContainer } from './app-overlay.container';
import { AppRoutePath } from './app-route-path.enum';
import { CalculationContainerComponent } from './calculation/calculation-container/calculation-container.component';
import { CalculationViewComponent } from './calculation-view/calculation-view.component';
import { CoreModule } from './core/core.module';
import { SettingsPanelComponent } from './shared/settings-panel/settings-panel.component';

export const appRoutePaths: Routes = [
  {
    path: AppRoutePath.BasePath,
    component: CalculationViewComponent,
    pathMatch: 'full',
  },
  {
    path: AppRoutePath.LegalPath,
    loadChildren: () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export const APP_ROOT = 'engineering-app';

export function DynamicTermsOfUse(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.termsOfUseContent');
}

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

export function DynamicStoragePeriod(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.storagePeriod');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    PushPipe,
    BrowserAnimationsModule,
    CalculationContainerComponent,
    SharedTranslocoModule,
    RouterModule.forRoot(appRoutePaths, { enableTracing: false }),

    // UI Modules
    AppShellModule,
    BannerModule,
    SettingsPanelComponent,
    LanguageSelectModule,
  ],
  providers: [
    TranslocoDecimalPipe,
    { provide: OverlayContainer, useClass: AppOverlayContainer },
    {
      provide: PERSON_RESPONSIBLE,
      useValue: 'Schaeffler Technologies AG & Co. KG',
    },
    {
      provide: TERMS_OF_USE,
      useFactory: DynamicTermsOfUse,
      deps: [TranslocoService],
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
