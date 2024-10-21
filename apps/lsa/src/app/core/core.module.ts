import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { environment } from '@lsa/environments/environment';
import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from '@lsa/shared/constants/language';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import deJson from '../../assets/i18n/de.json';
import enJson from '../../assets/i18n/en.json';

const assetPath = environment.assetsPath;

@NgModule({
  exports: [SharedTranslocoModule],
  imports: [
    SharedTranslocoModule.forRoot(
      environment.production,
      AVAILABLE_LANGUAGES,
      undefined, // default -> undefined would lead to browser detection
      FALLBACK_LANGUAGE.id,
      LANGUAGE_STORAGE_KEY,
      true,
      !environment.localDev,
      undefined,
      `${assetPath}/i18n`
    ),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class CoreModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
