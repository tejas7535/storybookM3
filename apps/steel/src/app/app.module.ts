import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PageNotFoundModule } from '@schaeffler/shared/empty-states';
import { SharedTranslocoModule } from '@schaeffler/shared/transloco';
import {
  BannerModule,
  FooterModule,
  HeaderModule,
  ScrollToTopModule,
  SidebarModule,
  SnackBarModule
} from '@schaeffler/shared/ui-components';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ExtensionComponent } from './home/extension/extension.component';
import { ExtensiondetailComponent } from './home/extension/extensiondetail/extensiondetail.component';
import { HomeComponent } from './home/home.component';

import { environment } from '../environments/environment';
import { StoreModule } from './core/store';
import { HammerConfig } from './shared/config';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExtensionComponent,
    ExtensiondetailComponent
  ],
  imports: [
    BannerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    FooterModule,
    ScrollToTopModule,
    SnackBarModule,
    HeaderModule,
    SidebarModule,
    PageNotFoundModule,
    StoreModule,
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en',
      'en',
      true
    )
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
