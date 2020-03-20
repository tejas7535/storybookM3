import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';
import {
  BannerModule,
  FooterModule,
  HeaderModule,
  ScrollToTopDirective,
  ScrollToTopModule,
  SettingsSidebarModule,
  SidebarModule,
  SnackBarModule,
  SpeedDialFabModule
} from '@schaeffler/shared/ui-components';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { environment } from '../environments/environment';
import { StoreModule } from './core/store';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BannerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatButtonModule,
    FlexLayoutModule,
    FooterModule,
    ScrollToTopModule,
    SnackBarModule,
    HeaderModule,
    SidebarModule,
    StoreModule,
    SpeedDialFabModule,
    SettingsSidebarModule,
    SharedTranslocoModule.forRoot(environment.production, ['en'], 'en', 'en')
  ],
  providers: [ScrollToTopDirective],
  bootstrap: [AppComponent]
})
export class AppModule {}
