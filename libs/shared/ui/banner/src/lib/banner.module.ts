import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { BannerTextModule } from './banner-text/banner-text.module';
import { BannerComponent } from './banner.component';
// tslint:disable: no-default-import */
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
/* tslint:enable: no-default-import */
import { StoreModule } from './store/store.module';

@NgModule({
  declarations: [BannerComponent],
  imports: [CommonModule, StoreModule, BannerTextModule, TranslocoModule],
  exports: [BannerComponent],
})
export class BannerModule {
  constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
