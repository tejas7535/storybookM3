// tslint:disable: no-default-import
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { BannerTextModule } from './banner-text/banner-text.module';
import { BannerComponent } from './banner.component';
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { StoreModule } from './store/store.module';

@NgModule({
  declarations: [BannerComponent],
  imports: [
    CommonModule,
    StoreModule,
    BannerTextModule,
    ReactiveComponentModule,
    TranslocoModule,
  ],
  exports: [BannerComponent],
})
export class BannerModule {
  constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
