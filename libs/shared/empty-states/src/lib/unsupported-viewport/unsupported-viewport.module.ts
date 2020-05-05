import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UnsupportedViewportComponent } from './unsupported-viewport.component';

@NgModule({
  imports: [SharedTranslocoModule, FlexLayoutModule],
  declarations: [UnsupportedViewportComponent],
  exports: [UnsupportedViewportComponent],
})
export class UnsupportedViewportModule {}
