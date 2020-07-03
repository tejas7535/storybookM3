import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BannerTextModule } from './banner-text/banner-text.module';
import { BannerComponent } from './banner.component';
import { StoreModule } from './store/store.module';

export const bannerLoader = ['en', 'de'].reduce((acc: any, lang: string) => {
  acc[lang] = () => import(`./i18n/${lang}.json`);

  return acc;
}, {});

@NgModule({
  declarations: [BannerComponent],
  imports: [
    CommonModule,
    StoreModule,
    BannerTextModule,
    SharedTranslocoModule.forChild('banner', bannerLoader),
  ],
  exports: [BannerComponent],
})
export class BannerModule {}
