import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
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
