import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslocoService } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { BannerModule } from '@schaeffler/banner';
import {
  PERSON_RESPONSIBLE,
  PURPOSE,
  STORAGE_PERIOD,
  TERMS_OF_USE,
} from '@schaeffler/legal-pages';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { UserSettingsModule } from './shared/components/user-settings';
import { responsiblePerson } from './shared/constants';

export function DynamicTermsOfUse(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.termsOfUseContent');
}

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
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    {
      provide: TERMS_OF_USE,
      useFactory: DynamicTermsOfUse,
      deps: [TranslocoService],
    },
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
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
