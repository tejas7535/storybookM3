import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AqmCalculatorComponent } from './aqm-calculator.component';

const routes: Routes = [{ path: '', component: AqmCalculatorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AqmCalculatorRoutingModule {}
