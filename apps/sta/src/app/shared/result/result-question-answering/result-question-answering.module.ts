import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';

import { QaChatModule } from './qa-chat/qa-chat.module';
import { ResultQuestionAnsweringComponent } from './result-question-answering.component';

@NgModule({
  declarations: [ResultQuestionAnsweringComponent],
  imports: [CommonModule, MatExpansionModule, FlexLayoutModule, QaChatModule],
  exports: [ResultQuestionAnsweringComponent],
})
export class ResultQuestionAnsweringModule {}
