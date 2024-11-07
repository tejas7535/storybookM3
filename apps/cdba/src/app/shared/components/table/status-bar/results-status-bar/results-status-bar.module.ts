import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PushPipe } from '@ngrx/component';

import { InViewModule } from '@cdba/shared/directives/in-view';

import { BomExportButtonComponent } from '../../button/bom-export-button';
import { CompareButtonModule } from '../../button/compare-button';
import { PortfolioAnalysisButtonModule } from '../../button/portfolio-analysis-button';
import { PaginationControlsModule } from '../../pagination-controls/pagination-controls.module';
import { PaginationControlsService } from '../../pagination-controls/service/pagination-controls.service';
import { ResultsStatusBarComponent } from './results-status-bar.component';

@NgModule({
  declarations: [ResultsStatusBarComponent],
  imports: [
    CommonModule,
    InViewModule,
    CompareButtonModule,
    PortfolioAnalysisButtonModule,
    BomExportButtonComponent,
    MatTooltipModule,
    PushPipe,
    PaginationControlsModule,
  ],
  providers: [PaginationControlsService],
  exports: [ResultsStatusBarComponent],
})
export class ResultsStatusBarModule {}
