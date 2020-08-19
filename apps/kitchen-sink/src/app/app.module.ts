import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BannerModule } from '@schaeffler/banner';
import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import { IconsModule } from '@schaeffler/icons';
import {
  ScrollToTopDirective,
  ScrollToTopModule,
} from '@schaeffler/scroll-to-top';
import { SettingsSidebarModule } from '@schaeffler/settings-sidebar';
import { SidebarModule } from '@schaeffler/sidebar';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SpeedDialFabModule } from '@schaeffler/speed-dial-fab';
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
    StoreModule,
    SidebarModule,
    SpeedDialFabModule,
    SettingsSidebarModule,
    SharedTranslocoModule.forRoot(environment.production, ['en'], 'en', 'en'),
    IconsModule,
    MatIconModule,
  ],
  providers: [ScrollToTopDirective],
  bootstrap: [AppComponent],
})
export class AppModule {}
