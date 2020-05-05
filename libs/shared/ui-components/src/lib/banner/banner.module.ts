import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BannerTextModule } from './banner-text/banner-text.module';
import { BannerComponent } from './banner.component';
import { StoreModule } from './store/store.module';

@NgModule({
  declarations: [BannerComponent],
  imports: [CommonModule, StoreModule, BannerTextModule, SharedTranslocoModule],
  exports: [BannerComponent],
})
export class BannerModule {}
