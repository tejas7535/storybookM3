import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from 'ag-grid-angular';

import { CustomHeaderComponent } from './custom-header-component/custom-header.component';
import { PortfolioAnalysisTableComponent } from './portfolio-analysis-table.component';
import { PortfolioAnalysisTableService } from './portfolio-analysis-table.service';

@NgModule({
  declarations: [PortfolioAnalysisTableComponent, CustomHeaderComponent],
  imports: [CommonModule, MatIconModule, AgGridModule],
  providers: [PortfolioAnalysisTableService],
  exports: [PortfolioAnalysisTableComponent],
})
export class PortfolioAnalysisTableModule {}
