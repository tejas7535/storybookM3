import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PageNotFoundModule } from '@schaeffler/shared/empty-states';
import {
  HeaderModule,
  SettingsSidebarModule,
  SidebarModule
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

// exported factory function for AOT
// tslint:disable-next-line
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    PageNotFoundModule,
    PredictionModule,
    SettingsSidebarModule,
    SidebarModule,
    UnauthorizedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    StoreModule
  ],
  declarations: [AppComponent, SignedoutComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService]
    },
    AuthGuard,
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
