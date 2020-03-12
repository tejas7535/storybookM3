import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';

import { IconModule } from '../../icon/icon.module';

import { BannerTextComponent } from './banner-text.component';

import { TruncatePipe } from '../truncate-pipe/truncate.pipe';

@NgModule({
  declarations: [BannerTextComponent, TruncatePipe],
  imports: [
    FlexLayoutModule,
    CommonModule,
    SharedTranslocoModule,
    MatButtonModule,
    IconModule
  ],
  exports: [BannerTextComponent, TruncatePipe]
})
export class BannerTextModule {}
