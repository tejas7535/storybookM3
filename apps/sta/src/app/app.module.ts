import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PageNotFoundModule } from '@schaeffler/shared/empty-states';
import {
  FooterModule,
  HeaderModule,
  SettingsSidebarModule,
  SidebarModule
} from '@schaeffler/shared/ui-components';

import { SnackBarModule } from './../../../../libs/shared/ui-components/src/lib/snackbar/snackbar.module';
import { AppRoutingModule } from './app-routing.module';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';

import { SnackBarComponent } from './../../../../libs/shared/ui-components/src/lib/snackbar/snackbar.component';
import { AppComponent } from './app.component';

import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

import { HammerConfig } from './config';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BreadcrumbModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FooterModule,
    HttpClientModule,
    HeaderModule,
    PageNotFoundModule,
    SettingsSidebarModule,
    SidebarModule,
    SnackBarModule
  ],
  entryComponents: [SnackBarComponent],
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
