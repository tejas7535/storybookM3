import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';

import {
  TRANSLOCO_CONFIG,
  TranslocoConfig,
  TranslocoModule
} from '@ngneat/transloco';
import { PageNotFoundModule } from '@schaeffler/shared/empty-states';
import {
  FooterModule,
  ScrollToTopModule
} from '@schaeffler/shared/ui-components';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { environment } from '../environments/environment';
import { translocoLoader } from './transloco.loader';

const translocoConfig: TranslocoConfig = {
  availableLangs: ['en'],
  defaultLang: 'en',
  prodMode: environment.production
};

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    MatButtonModule,
    FooterModule,
    ScrollToTopModule,
    HttpClientModule,
    TranslocoModule,
    PageNotFoundModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig
    },
    translocoLoader
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
