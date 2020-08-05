import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import { IconsModule } from '@schaeffler/icons';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { HttpModule } from './http/http.module';
import { StoreModule } from './store/store.module';

registerLocaleData(de, 'de-DE');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,

    // UI Modules
    IconsModule,
    HeaderModule,
    FooterModule,
    MatButtonModule,

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

    // notifications
    SnackBarModule,
  ],
  exports: [AppComponent],
})
export class CoreModule {}
