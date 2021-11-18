import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoService } from '@ngneat/transloco';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LocaleSelectComponent } from './locale-select.component';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';

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
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }
}
