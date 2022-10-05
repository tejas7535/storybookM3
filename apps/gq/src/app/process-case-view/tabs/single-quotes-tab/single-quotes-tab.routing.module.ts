import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SingleQuotesTabComponent } from './single-quotes-tab.component';

const routes: Routes = [{ path: '', component: SingleQuotesTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleQuotesTabRoutingModule {}
