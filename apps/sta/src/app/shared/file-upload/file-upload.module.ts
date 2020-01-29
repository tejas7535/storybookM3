import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import { FileDropModule } from '@schaeffler/shared/ui-components';

import { FileUploadComponent } from './file-upload.component';

import { FileTypeToIconPipe } from './file-type-to-icon.pipe';

@NgModule({
  declarations: [FileUploadComponent, FileTypeToIconPipe],
  imports: [CommonModule, FlexLayoutModule, FileDropModule, MatIconModule],
  exports: [FileUploadComponent]
})
export class FileUploadModule {}
