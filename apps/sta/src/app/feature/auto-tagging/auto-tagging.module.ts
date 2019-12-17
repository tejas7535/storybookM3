import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';

import { AutoTaggingRoutingModule } from './auto-tagging-routing.module';
import { AutoTaggingComponent } from './auto-tagging.component';
import { FileUploadModule } from './file-upload/file-upload.module';
import { TextInputModule } from './text-input/text-input.module';

@NgModule({
  declarations: [AutoTaggingComponent],
  imports: [
    AutoTaggingRoutingModule,
    CommonModule,
    FlexLayoutModule,
    MatTabsModule,
    TextInputModule,
    FileUploadModule
  ],
  exports: [AutoTaggingComponent]
})
export class AutoTaggingModule {}
