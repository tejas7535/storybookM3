import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComparisonSummaryTabComponent } from './comparison-summary-tab.component';

const routes: Routes = [{ path: '', component: ComparisonSummaryTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComparisonSummaryTabRoutingModule {}
