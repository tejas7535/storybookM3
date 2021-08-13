import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslocoService } from '@ngneat/transloco';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import deJson from '../assets/i18n/de.json';
import enJson from '../assets/i18n/en.json';
import esJson from '../assets/i18n/es.json';
import frJson from '../assets/i18n/fr.json';
import ruJson from '../assets/i18n/ru.json';
import zhJson from '../assets/i18n/zh.json';
import { LegalRoutingModule } from './legal-routing.module';
import { LegalComponent } from './legal.component';

@NgModule({
  declarations: [LegalComponent],
  imports: [
    LegalRoutingModule,
    SubheaderModule,
    SharedTranslocoModule,
    RouterModule,
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
