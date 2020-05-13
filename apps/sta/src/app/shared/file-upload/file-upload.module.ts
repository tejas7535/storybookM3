import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import { FileDropModule } from '@schaeffler/file-drop';

import { FileTypeToIconPipe } from './file-type-to-icon.pipe';
import { FileUploadComponent } from './file-upload.component';

@NgModule({
  declarations: [FileUploadComponent, FileTypeToIconPipe],
  imports: [CommonModule, FlexLayoutModule, FileDropModule, MatIconModule],
  exports: [FileUploadComponent],
})
export class FileUploadModule {}
