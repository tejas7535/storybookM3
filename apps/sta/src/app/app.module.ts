import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AzureConfig, FlowType, SharedAuthModule } from '@schaeffler/auth';
import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import { IconsModule } from '@schaeffler/icons';
import { SettingsSidebarModule } from '@schaeffler/settings-sidebar';
import { SidebarModule } from '@schaeffler/sidebar';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LandingModule } from './feature/landing/landing.module';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { ResultModule } from './shared/result/result.module';

const azureConfig = new AzureConfig(
  environment.azureTenantId,
  environment.azureClientId,
  environment.azureBackendAPI,
  FlowType.CODE_FLOW,
  !environment.production
);

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    SharedAuthModule.forRoot(azureConfig),
    FlexLayoutModule,
    FooterModule,
    HttpClientModule,
    HeaderModule,
    MatButtonModule,
    MatIconModule,
    ResultModule,
    SettingsSidebarModule,
    SidebarModule,
    SnackBarModule,
    LandingModule,
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en', 'de'],
      undefined,
      'en',
      true
    ),
    IconsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
