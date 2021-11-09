import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { ReactiveComponentModule } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';

import {
  LoadingSpinnerModule,
  BrowserSupportModule,
  UserSettingsModule,
  RoleDescriptionsModule,
} from '@cdba/shared/components';

import { CoreModule } from '@cdba/core';
import { ENV, getEnv } from '@cdba/environments/environment.provider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    MatDividerModule,
    LoadingSpinnerModule,
    BrowserSupportModule,
    AppShellModule,
    UserSettingsModule,
    RoleDescriptionsModule,
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
