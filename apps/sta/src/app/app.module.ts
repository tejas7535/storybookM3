import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IconsModule } from '@schaeffler/shared/icons';
import { SharedTranslocoModule } from '@schaeffler/shared/transloco';
import {
  FooterModule,
  HeaderModule,
  SettingsSidebarModule,
  SidebarModule,
  SnackBarModule
} from '@schaeffler/shared/ui-components';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LandingModule } from './feature/landing/landing.module';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { ResultModule } from './shared/result/result.module';

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
    ),
    IconsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
