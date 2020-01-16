import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslocoModule } from '@ngneat/transloco';

import { BannerTextComponent } from './banner-text.component';

import { TruncatePipe } from '../truncate-pipe/truncate.pipe';

@NgModule({
  declarations: [BannerTextComponent, TruncatePipe],
  entryComponents: [BannerTextComponent],
  imports: [FlexLayoutModule, CommonModule, TranslocoModule],
  exports: [BannerTextComponent, TruncatePipe]
})
export class BannerTextModule {}
