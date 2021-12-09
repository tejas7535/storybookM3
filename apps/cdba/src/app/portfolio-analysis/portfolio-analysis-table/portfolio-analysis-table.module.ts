import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from '@ag-grid-community/angular';

import { PortfolioAnalysisTableComponent } from './portfolio-analysis-table.component';
import { PortfolioAnalysisTableService } from './portfolio-analysis-table.service';

@NgModule({
  declarations: [PortfolioAnalysisTableComponent],
  imports: [CommonModule, AgGridModule.withComponents([])],
  providers: [PortfolioAnalysisTableService],
  exports: [PortfolioAnalysisTableComponent],
})
export class PortfolioAnalysisTableModule {}
