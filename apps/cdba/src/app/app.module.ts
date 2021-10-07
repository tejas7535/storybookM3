import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { ReactiveComponentModule } from '@ngrx/component';

import {
  LoadingSpinnerModule,
  BrowserSupportModule,
  UserSettingsModule,
} from '@cdba/shared/components';

import { CoreModule } from '@cdba/core';
import { AppShellModule } from '@schaeffler/app-shell';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ENV, getEnv } from '@cdba/environments/environment.provider';

@NgModule({
  imports: [
    // angular modules
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),
    ReactiveComponentModule,
    CommonModule,

    // core and routing modules
    AppRoutingModule,
    CoreModule,

    // ui and app root modules
    LoadingSpinnerModule,
    BrowserSupportModule,
    AppShellModule,
    UserSettingsModule,
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: ENV,
      useFactory: getEnv,
    },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
