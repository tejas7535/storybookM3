import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';

import { FileUploadModule } from '../../shared/file-upload/file-upload.module';
import { TextInputModule } from '../../shared/text-input/text-input.module';
import { QuestionAnsweringRoutingModule } from './question-answering-routing.module';
import { QuestionAnsweringComponent } from './question-answering.component';

@NgModule({
  declarations: [QuestionAnsweringComponent],
  imports: [
    QuestionAnsweringRoutingModule,
    CommonModule,
    FlexLayoutModule,
    MatTabsModule,
    TextInputModule,
    FileUploadModule,
  ],
})
export class QuestionAnsweringModule {}
