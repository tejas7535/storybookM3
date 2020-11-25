import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';

import { FileUploadModule } from '../../shared/file-upload/file-upload.module';
import { TextInputModule } from '../../shared/text-input/text-input.module';
import { AutoTaggingRoutingModule } from './auto-tagging-routing.module';

import { AutoTaggingComponent } from './auto-tagging.component';

@NgModule({
  declarations: [AutoTaggingComponent],
  imports: [
    AutoTaggingRoutingModule,
    CommonModule,
    FlexLayoutModule,
    MatTabsModule,
    TextInputModule,
    FileUploadModule,
  ],
  exports: [AutoTaggingComponent],
})
export class AutoTaggingModule {}
