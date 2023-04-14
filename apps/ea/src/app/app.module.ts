import { Injector, isDevMode, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { PushModule } from '@ngrx/component';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    PushModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          loadComponent: () =>
            import(
              './calculation/calculation-container/calculation-container.component'
            ).then((m) => m.CalculationContainerComponent),
        },
        { path: '**', redirectTo: '' },
      ],
      { enableTracing: isDevMode(), preloadingStrategy: PreloadAllModules }
    ),
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
