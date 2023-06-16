import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { BannerComponent } from './banner.component';
import { BannerTextModule } from './banner-text/banner-text.module';
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { StoreModule } from './store/store.module';

@NgModule({
  declarations: [BannerComponent],
  imports: [
    CommonModule,
    StoreModule,
    BannerTextModule,
    PushPipe,
    TranslocoModule,
  ],
  exports: [BannerComponent],
})
export class BannerModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
