import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslocoModule } from '@ngneat/transloco';

import { CustomBannerComponent } from './custom-banner.component';

@NgModule({
  declarations: [CustomBannerComponent],
  entryComponents: [CustomBannerComponent],
  imports: [TranslocoModule, FlexLayoutModule, CommonModule],
  exports: [CustomBannerComponent]
})
export class CustomBannerModule {}
