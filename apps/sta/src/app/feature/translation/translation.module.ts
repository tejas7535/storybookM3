import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';

import { FileUploadModule } from '../../shared/file-upload/file-upload.module';
import { FunFactsLoadingBarModule } from '../../shared/fun-facts-loading-bar/fun-facts-loading-bar.module';
import { TextInputModule } from '../../shared/text-input/text-input.module';
import { TranslationRoutingModule } from './translation-routing.module';

import { TranslationComponent } from './translation.component';

@NgModule({
  declarations: [TranslationComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatTabsModule,
    TextInputModule,
    FileUploadModule,
    TranslationRoutingModule,
    FunFactsLoadingBarModule,
  ],
  exports: [TranslationComponent],
})
export class TranslationModule {}
