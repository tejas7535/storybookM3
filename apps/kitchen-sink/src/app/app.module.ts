import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import { IconsModule } from '@schaeffler/icons';
import {
  BannerModule,
  ScrollToTopDirective,
  ScrollToTopModule,
  SettingsSidebarModule,
  SnackBarModule,
  SpeedDialFabModule,
} from '@schaeffler/shared/ui-components';
import { SidebarModule } from '@schaeffler/sidebar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from './core/store';
import { HomeComponent } from './home/home.component';

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
    SharedTranslocoModule.forRoot(environment.production, ['en'], 'en', 'en'),
    IconsModule,
  ],
  providers: [ScrollToTopDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
