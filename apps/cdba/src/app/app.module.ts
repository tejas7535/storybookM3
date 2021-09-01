import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { SharedModule } from '@cdba/shared';
import {
  LoadingSpinnerModule,
  BrowserSupportModule,
  UserSettingsModule,
} from '@cdba/shared/components';

import { CoreModule } from '@cdba/core';
import { AppShellModule } from '@schaeffler/app-shell';
import { FooterModule } from '@schaeffler/footer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ENV, getEnv } from '@cdba/environments/environment.provider';

@NgModule({
  imports: [
    AppRoutingModule,
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),

    CoreModule,
    SharedModule,

    LoadingSpinnerModule,
    BrowserSupportModule,
    AppShellModule,
    FooterModule,
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
