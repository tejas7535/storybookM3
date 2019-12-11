import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { ResultAutoTaggingComponent } from './result-auto-tagging/result-auto-tagging.component';
import { ResultComponent } from './result.component';

@NgModule({
  declarations: [ResultComponent, ResultAutoTaggingComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule
  ],
  exports: [ResultComponent]
})
export class ResultModule {}
