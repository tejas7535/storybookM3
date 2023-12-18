import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoService } from '@ngneat/transloco';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { SharedTranslocoModule } from '@schaeffler/transloco';

import deutsch from './i18n/de.json';
import english from './i18n/en.json';
import spanish from './i18n/es.json';
import french from './i18n/fr.json';
import indoenesianBahasa from './i18n/id.json';
import italian from './i18n/it.json';
import japanese from './i18n/ja.json';
import korean from './i18n/ko.json';
import russian from './i18n/ru.json';
import thai from './i18n/th.json';
import vietnamese from './i18n/vi.json';
import chineseSimplified from './i18n/zh.json';
import chineseTraditional from './i18n/zh_TW.json';
import { LocaleSelectComponent } from './locale-select.component';

@NgModule({
  declarations: [LocaleSelectComponent],
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
    MatTooltipModule,
  ],
  exports: [LocaleSelectComponent],
})
export class LocaleSelectModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(deutsch, 'de');
    this.translocoService.setTranslation(english, 'en');
    this.translocoService.setTranslation(spanish, 'es');
    this.translocoService.setTranslation(french, 'fr');
    this.translocoService.setTranslation(italian, 'it');
    this.translocoService.setTranslation(japanese, 'ja');
    this.translocoService.setTranslation(russian, 'ru');
    this.translocoService.setTranslation(chineseSimplified, 'zh');
    this.translocoService.setTranslation(chineseTraditional, 'zh_TW');
    this.translocoService.setTranslation(indoenesianBahasa, 'id');
    this.translocoService.setTranslation(korean, 'ko');
    this.translocoService.setTranslation(thai, 'th');
    this.translocoService.setTranslation(vietnamese, 'vi');
  }
}
