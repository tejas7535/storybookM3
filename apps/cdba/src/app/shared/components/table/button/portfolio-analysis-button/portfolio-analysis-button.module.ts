import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { LetDirective } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PortfolioAnalysisButtonComponent } from './portfolio-analysis-button.component';

@NgModule({
  imports: [
    RouterModule,
    LetDirective,
    MatButtonModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  declarations: [PortfolioAnalysisButtonComponent],
  exports: [PortfolioAnalysisButtonComponent],
})
export class PortfolioAnalysisButtonModule {}
