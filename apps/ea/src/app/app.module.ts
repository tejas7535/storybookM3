import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PushModule } from '@ngrx/component';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CalculationParametersComponent } from './features/calculation-parameters/calculation-parameters';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    PushModule,
    BrowserAnimationsModule,
    CalculationParametersComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private readonly injector: Injector) {}

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngDoBootstrap() {
    const el = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('engineering-app', el);
  }
}
