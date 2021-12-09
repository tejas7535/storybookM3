import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PortfolioAnalysisComponent } from './portfolio-analysis.component';

const routes: Routes = [{ path: '', component: PortfolioAnalysisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioAnalysisRoutingModule {}
