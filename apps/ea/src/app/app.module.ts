import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PushPipe } from '@ngrx/component';

import { AppComponent } from './app.component';
import { CalculationContainerComponent } from './calculation/calculation-container/calculation-container.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    PushPipe,
    BrowserAnimationsModule,
    CalculationContainerComponent,
  ],
  providers: [],
})
export class AppModule implements DoBootstrap {
  constructor(readonly injector: Injector) {
    const webComponent = createCustomElement(AppComponent, { injector });
    customElements.define('engineering-app', webComponent);
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngDoBootstrap(_appRef: ApplicationRef) {
    // this function is required by Angular but not actually necessary since we create a web component here
  }
}
