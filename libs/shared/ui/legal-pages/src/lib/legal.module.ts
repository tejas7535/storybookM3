import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { SubheaderModule } from '@schaeffler/subheader';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';
import { LegalComponent } from './legal.component';
import { LegalRoutingModule } from './legal-routing.module';

@NgModule({
  declarations: [LegalComponent],
  imports: [
    CommonModule,
    LegalRoutingModule,
    SubheaderModule,
    TranslocoModule,
    RouterModule,
    PushPipe,
  ],
  exports: [LegalComponent],
})
export class LegalModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }
}
