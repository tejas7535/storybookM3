import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { IconModule } from '@schaeffler/shared/ui-components';

import { ResultAutoTaggingComponent } from './result-auto-tagging/result-auto-tagging.component';
import { ResultTranslationComponent } from './result-translation/result-translation.component';
import { ResultComponent } from './result.component';

@NgModule({
  declarations: [
    ResultComponent,
    ResultAutoTaggingComponent,
    ResultTranslationComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    IconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [ResultComponent]
})
export class ResultModule {}
