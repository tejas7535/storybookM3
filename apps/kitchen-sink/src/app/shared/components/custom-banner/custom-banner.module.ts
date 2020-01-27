import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CustomBannerComponent } from './custom-banner.component';

@NgModule({
  declarations: [CustomBannerComponent],
  entryComponents: [CustomBannerComponent],
  imports: [FlexLayoutModule, CommonModule],
  exports: [CustomBannerComponent]
})
export class CustomBannerModule {}
