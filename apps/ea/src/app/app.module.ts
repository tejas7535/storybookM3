import { OverlayContainer } from '@angular/cdk/overlay';
import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PushPipe } from '@ngrx/component';

import { Router, RouterModule, Routes } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { AppShellModule } from '@schaeffler/app-shell';
import {
  PERSON_RESPONSIBLE,
  PURPOSE,
  STORAGE_PERIOD,
  TERMS_OF_USE,
} from '@schaeffler/legal-pages';
import { AppOverlayContainer } from './app-overlay.container';
import { AppComponent } from './app.component';

import { AppRoutePath } from './app-route-path.enum';
import { CalculationViewComponent } from './calculation-view/calculation-view.component';
import { CalculationContainerComponent } from './calculation/calculation-container/calculation-container.component';
import { CoreModule } from './core/core.module';

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
    RouterModule.forRoot(appRoutePaths, { enableTracing: false }),

    // UI Modules
    AppShellModule,
  ],
  providers: [
    { provide: OverlayContainer, useClass: AppOverlayContainer },
    {
      provide: PERSON_RESPONSIBLE,
      useValue: 'Max Mustermann',
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
  constructor(readonly injector: Injector, private readonly router: Router) {
    const webComponent = createCustomElement(AppComponent, { injector });
    customElements.define(APP_ROOT, webComponent);
  }

  ngDoBootstrap(_appRef: ApplicationRef) {
    // This is necessary because the AppComponent as part of the initial route doesn't show up since we're using a webcomponent.
    // This seems to be a known bug and this is the workaround
    // @see https://github.com/angular/angular/issues/23740
    this.router.initialNavigation();
  }
}
