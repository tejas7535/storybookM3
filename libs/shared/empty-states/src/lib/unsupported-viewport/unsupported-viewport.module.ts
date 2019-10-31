import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslocoModule } from '@ngneat/transloco';

import { UnsupportedViewportComponent } from './unsupported-viewport.component';

@NgModule({
  imports: [TranslocoModule, FlexLayoutModule],
  declarations: [UnsupportedViewportComponent],
  exports: [UnsupportedViewportComponent]
})
export class UnsupportedViewportModule {}
