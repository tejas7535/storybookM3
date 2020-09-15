import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AgGridModule } from '@ag-grid-community/angular';

import { ResultSectionComponent } from './result-section.component';

@NgModule({
  declarations: [ResultSectionComponent],
  imports: [CommonModule, AgGridModule.withComponents([]), FlexLayoutModule],
  exports: [ResultSectionComponent],
})
export class ResultSectionModule {}
