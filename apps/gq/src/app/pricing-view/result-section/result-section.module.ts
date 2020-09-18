import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AgGridModule } from '@ag-grid-community/angular';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ResultSectionComponent } from './result-section.component';

@NgModule({
  declarations: [ResultSectionComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    FlexLayoutModule,
    SharedTranslocoModule,
  ],
  exports: [ResultSectionComponent],
})
export class ResultSectionModule {}
