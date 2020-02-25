import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';
import {
  FooterModule,
  HeaderModule,
  SettingsSidebarModule,
  SidebarModule,
  SnackBarModule
} from '@schaeffler/shared/ui-components';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ResultModule } from './shared/result/result.module';

import { AppComponent } from './app.component';

import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

import { environment } from '../environments/environment';
import { HammerConfig } from './config';
import { LandingModule } from './feature/landing/landing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
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
    )
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
