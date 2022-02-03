import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PortfolioAnalysisButtonComponent } from './portfolio-analysis-button.component';

@NgModule({
  imports: [
    RouterModule,
    MatButtonModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
  ],
  declarations: [PortfolioAnalysisButtonComponent],
  exports: [PortfolioAnalysisButtonComponent],
})
export class PortfolioAnalysisButtonModule {}
