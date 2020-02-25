import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';

import { BannerTextComponent } from './banner-text.component';

import { TruncatePipe } from '../truncate-pipe/truncate.pipe';

@NgModule({
  declarations: [BannerTextComponent, TruncatePipe],
  imports: [FlexLayoutModule, CommonModule, SharedTranslocoModule],
  exports: [BannerTextComponent, TruncatePipe]
})
export class BannerTextModule {}
