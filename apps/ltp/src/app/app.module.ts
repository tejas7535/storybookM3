import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';
import {
  HeaderModule,
  SettingsSidebarModule
} from '@schaeffler/shared/ui-components';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from './core/store/store.module';
import { InputModule } from './feature/input/input.module';
import { PredictionModule } from './feature/prediction/prediction.module';
import { UnauthorizedModule } from './shared/components/unauthorized/unauthorized.module';

import { AppComponent } from './app.component';
import { SignedoutComponent } from './shared/components/signedout/signedout.component';

import { environment } from '../environments/environment';
import { initializer } from './app-init';
import { AuthGuard } from './core/guards/auth.guard';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HeaderModule,
    HttpClientModule,
    InputModule,
    KeycloakAngularModule,
    MatButtonModule,
    PredictionModule,
    SettingsSidebarModule,
    UnauthorizedModule,
    StoreModule,
    SharedTranslocoModule.forRoot(
      environment.production,
      ['de', 'en'],
      undefined,
      'en'
    )
  ],
  declarations: [AppComponent, SignedoutComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService]
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
