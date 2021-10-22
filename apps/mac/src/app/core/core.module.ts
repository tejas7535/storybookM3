import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { AppShellModule } from '@schaeffler/app-shell';
import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { HeaderModule } from '@schaeffler/header';
import { HttpModule } from '@schaeffler/http';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { RootEffects } from './effects/root/root.effects';
import { StoreModule } from './store/store.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,
    ReactiveComponentModule,

    // UI Modules
    HeaderModule,
    MatButtonModule,
    AppShellModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true,
      !environment.localDev
    ),

    // HTTP
    HttpModule.forRoot({ environment }),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),

    // Add department to app insights
    EffectsModule.forRoot([RootEffects]),
  ],
  exports: [AppComponent],
})
export class CoreModule {}
