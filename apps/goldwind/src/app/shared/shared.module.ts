import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PreviewContainerComponent } from './preview-container/preview-container.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, SharedTranslocoModule],
  exports: [
    CommonModule,
    FlexLayoutModule,
    PreviewContainerComponent,
    SharedTranslocoModule,
  ],
  declarations: [PreviewContainerComponent],
})
export class SharedModule {}
