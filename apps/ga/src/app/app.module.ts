import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs/internal/Observable';

import { TranslocoService } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { BannerModule } from '@schaeffler/banner';
import {
  CUSTOM_DATA_PRIVACY,
  CUSTOM_IMPRINT_DATA,
  PERSON_RESPONSIBLE,
  PURPOSE,
  STORAGE_PERIOD,
  TERMS_OF_USE,
} from '@schaeffler/legal-pages';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { detectPartnerVersion } from './core/helpers/settings-helpers';
import { UserSettingsModule } from './shared/components/user-settings';
import { responsiblePerson } from './shared/constants';
import { PartnerVersion } from './shared/models';

const schmeckthalPrefixValue =
  detectPartnerVersion() === PartnerVersion.Schmeckthal
    ? `partnerVersion.${PartnerVersion.Schmeckthal}.`
    : '';

export function DynamicTermsOfUse(
  translocoService: TranslocoService,
  partnerPrefix: string
) {
  return translocoService.selectTranslateObject(
    `${partnerPrefix}legal.termsOfUseContent`
  );
}

export function DynamicDataPrivacy(
  translocoService: TranslocoService,
  partnerPrefix: string
): Observable<string> | void {
  if (!partnerPrefix) {
    return translocoService.selectTranslate('legal.schaefflerDataPrivacy');
  }

  return translocoService.selectTranslate(
    `${partnerPrefix}legal.customDataPrivacy`
  );
}

export function DynamicImprintData(
  translocoService: TranslocoService,
  partnerPrefix: string
): Observable<string> | void {
  if (!partnerPrefix) {
    return;
  }

  return translocoService.selectTranslate(`${partnerPrefix}legal.imprint`);
}

export const PARTNER_PREFIX = new InjectionToken<string>('');

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

export function DynamicStoragePeriod(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.storagePeriod');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    // angular modules
    CommonModule,
    BrowserAnimationsModule,
    PushPipe,
    LetDirective,

    // core and routing modules
    AppRoutingModule,
    CoreModule,

    // ui modules
    AppShellModule,
    UserSettingsModule,
    BannerModule,
  ],
  providers: [
    {
      provide: PARTNER_PREFIX,
      useValue: schmeckthalPrefixValue,
    },
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    {
      provide: TERMS_OF_USE,
      useFactory: DynamicTermsOfUse,
      deps: [TranslocoService, PARTNER_PREFIX],
    },
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
    },
    {
      provide: CUSTOM_DATA_PRIVACY,
      useFactory: DynamicDataPrivacy,
      deps: [TranslocoService, PARTNER_PREFIX],
    },
    {
      provide: CUSTOM_IMPRINT_DATA,
      useFactory: DynamicImprintData,
      deps: [TranslocoService, PARTNER_PREFIX],
    },
    {
      provide: STORAGE_PERIOD,
      useFactory: DynamicStoragePeriod,
      deps: [TranslocoService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
