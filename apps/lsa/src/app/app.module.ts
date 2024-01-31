import { CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  DoBootstrap,
  forwardRef,
  Injector,
  NgModule,
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserModule } from '@angular/platform-browser';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LsaStepperComponent } from './core/lsa-stepper/lsa-stepper.component';
import { LsaAppService } from './core/services/lsa-app.service';

export const APP_ROOT = 'lubricator-selection-assistant';

@NgModule({
  declarations: [AppComponent],
  providers: [LsaAppService],
  imports: [
    BrowserModule,
    CoreModule,
    SharedTranslocoModule,
    forwardRef(() => LsaStepperComponent),
    CdkStepperModule,
    MatDividerModule,
    CommonModule,
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
