import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';
import {
  HeaderModule,
  SettingsSidebarModule
} from '@schaeffler/shared/ui-components';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { StoreModule } from './core/store/store.module';
import { InputModule } from './feature/input/input.module';
import { PredictionModule } from './feature/prediction/prediction.module';
import { UnauthorizedModule } from './shared/components/unauthorized/unauthorized.module';

import { AppComponent } from './app.component';
import { SignedoutComponent } from './shared/components/signedout/signedout.component';

import { environment } from '../environments/environment';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    FlexLayoutModule,
    HeaderModule,
    HttpClientModule,
    InputModule,
    MatButtonModule,
    PredictionModule,
    SettingsSidebarModule,
    UnauthorizedModule,
    StoreModule,
    SharedTranslocoModule.forRoot(
      environment.production,
      ['de', 'en'],
      undefined,
      'en',
      true
    )
  ],
  declarations: [AppComponent, SignedoutComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
