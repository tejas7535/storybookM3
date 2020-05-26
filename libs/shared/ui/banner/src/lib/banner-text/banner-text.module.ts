import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { TruncatePipe } from '../truncate-pipe/truncate.pipe';
import { BannerTextComponent } from './banner-text.component';

@NgModule({
  declarations: [BannerTextComponent, TruncatePipe],
  imports: [
    FlexLayoutModule,
    CommonModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [BannerTextComponent, TruncatePipe],
})
export class BannerTextModule {}
