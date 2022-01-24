import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import { IconsModule } from '@schaeffler/icons';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { HttpErrorInterceptor } from '../core/http/interceptors/http-error.interceptor';
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
    FooterModule,
    HeaderModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    IconsModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true,
      !environment.localDev
    ),

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
