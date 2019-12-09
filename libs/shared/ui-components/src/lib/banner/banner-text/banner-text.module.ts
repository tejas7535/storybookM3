import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslocoModule } from '@ngneat/transloco';

import { TruncatePipe } from '../truncate-pipe/truncate.pipe';
import { BannerTextComponent } from './banner-text.component';

@NgModule({
  declarations: [BannerTextComponent, TruncatePipe],
  entryComponents: [BannerTextComponent],
  imports: [TranslocoModule, FlexLayoutModule, CommonModule],
  exports: [BannerTextComponent, TruncatePipe]
})
export class BannerTextModule {}
