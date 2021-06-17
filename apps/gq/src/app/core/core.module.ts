import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { FooterTailwindModule } from '@schaeffler/footer-tailwind';
import { HeaderModule } from '@schaeffler/header';
import { HttpErrorInterceptor, HttpModule } from '@schaeffler/http';
import { IconsModule } from '@schaeffler/icons';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import i18nChecksumsJson from '../../i18n-checksums.json';
import { AppComponent } from '../app.component';
import { StoreModule } from './store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,

    // UI Modules
    HeaderModule,
    IconsModule,
    MatButtonModule,
    FooterTailwindModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true,
      i18nChecksumsJson
    ),

    // HTTP
    HttpModule.forRoot({ environment }),

    // Monitoring
    ApplicationInsightsModule.forRoot(environment.applicationInsights),

    // notifications
    SnackBarModule,
  ],
  exports: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
