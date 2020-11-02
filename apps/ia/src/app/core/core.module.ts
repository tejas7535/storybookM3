import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { AzureConfig, FlowType, SharedAuthModule } from '@schaeffler/auth';
import { HeaderModule } from '@schaeffler/header';
import { HttpModule } from '@schaeffler/http';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { FilterSectionModule } from '../filter-section/filter-section.module';
import { StoreModule } from './store/store.module';

const azureConfig = new AzureConfig(
  environment.tenantId,
  environment.clientId,
  environment.appId,
  FlowType.CODE_FLOW,
  !environment.production
);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    ReactiveComponentModule,
    RouterModule,

    // UI Modules
    HeaderModule,
    MatButtonModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true
    ),

    // Auth
    SharedAuthModule.forRoot(azureConfig),
    MatProgressSpinnerModule,

    // http
    HttpModule.forRoot({ environment }),

    // filter section at the top
    FilterSectionModule,
  ],
  exports: [AppComponent],
})
export class CoreModule {}
