import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
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

    // UI Modules
    HeaderModule,
    FooterModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true
    ),

    ReactiveComponentModule,
  ],
  providers: [],
  exports: [AppComponent],
})
export class CoreModule {}
