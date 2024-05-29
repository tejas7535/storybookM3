import { CommonModule, DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { environment } from '@hc/environments/environment';
import { TranslocoService } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
  SharedAzureAuthModule,
} from '@schaeffler/azure-auth';
import { BannerModule } from '@schaeffler/banner';
import {
  DATA_SOURCE,
  PERSON_RESPONSIBLE,
  PURPOSE,
} from '@schaeffler/legal-pages';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CopyInputComponent } from './components/copy-input/copy-input.component';
import { GeometricalInformationComponent } from './components/geometrical-information/geometrical-information.component';
import { HardnessConverterComponent } from './components/hardness-converter/hardness-converter.component';
import { LearnMoreComponent } from './components/learn-more/learn-more.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './services/auth.interceptor';

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

export function DynamicDataSource(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.dataSource');
}

const azureConfig = new AzureConfig(
  new MsalInstanceConfig(
    environment.authentication.clientId,
    environment.authentication.tenantId,
    !environment.production
  ),
  new MsalInterceptorConfig([
    new ProtectedResource('/nowhere', [environment.authentication.appScope]),
  ]),
  new MsalGuardConfig('/kaputt', [environment.authentication.appScope])
);

@NgModule({
  declarations: [AppComponent, HardnessConverterComponent],
  imports: [
    // angular modules
    CommonModule,
    BrowserAnimationsModule,
    PushPipe,
    LetDirective,
    CoreModule,
    AppRoutingModule,

    // MSAL config
    SharedAzureAuthModule.forRoot(azureConfig),
    StoreModule.forRoot(),
    EffectsModule.forRoot(),
    GeometricalInformationComponent,
    CopyInputComponent,

    SettingsPanelComponent,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule,
    ReactiveFormsModule,
    PushPipe,
    LearnMoreComponent,
    BannerModule,

    // UI Modules
    AppShellModule,
  ],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: 'Schaeffler Technologies AG & Co. KG',
    },
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
    },
    {
      provide: DATA_SOURCE,
      useFactory: DynamicDataSource,
      deps: [TranslocoService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DecimalPipe,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
