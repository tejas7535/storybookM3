import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { FooterTailwindModule } from '@schaeffler/footer-tailwind';
import { HeaderModule } from '@schaeffler/header';
import { HttpErrorInterceptor, HttpModule } from '@schaeffler/http';
import { IconsModule } from '@schaeffler/icons';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { StoreModule } from './store/store.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,
    ReactiveComponentModule,

    // UI Modules
    IconsModule,
    FooterTailwindModule,
    HeaderModule,
    MatButtonModule,
    MatProgressSpinnerModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true
    ),

    // HTTP
    HttpModule.forRoot({ environment }),

    // Notifications
    SnackBarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  exports: [AppComponent],
})
export class CoreModule {}
