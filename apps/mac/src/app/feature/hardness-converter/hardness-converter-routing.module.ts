import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HardnessConverterComponent } from './hardness-converter.component';

const routes: Routes = [{ path: '', component: HardnessConverterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HardnessConverterRoutingModule {}
