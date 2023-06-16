import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { TranslocoService } from '@ngneat/transloco';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { SharedTranslocoModule } from '@schaeffler/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import jaJson from './i18n/ja.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';
import { LanguageSelectComponent } from './language-select.component';

@NgModule({
  declarations: [LanguageSelectComponent],
  imports: [
    // angular modules
    CommonModule,
    ReactiveFormsModule,

    // shared modules
    SharedTranslocoModule,

    // ui modules
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
  ],
  exports: [LanguageSelectComponent],
})
export class LanguageSelectModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(jaJson, 'ja');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }
}
