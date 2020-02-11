import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PageNotFoundModule } from '@schaeffler/shared/empty-states';
import { SharedTranslocoModule } from '@schaeffler/shared/transloco';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { HammerConfig } from './shared/config';

import { SnackBarModule } from '@schaeffler/shared/ui-components';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    PageNotFoundModule,
    BrowserAnimationsModule,
    SnackBarModule,
    SharedTranslocoModule.forRoot(environment.production, ['en'], 'en', 'en')
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
