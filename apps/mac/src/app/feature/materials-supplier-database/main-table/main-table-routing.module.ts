import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainTableComponent } from './main-table.component';

export enum MainTablePaths {
  BasePath = '',
}

const routes: Routes = [
  { path: MainTablePaths.BasePath, component: MainTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTableRoutingModule {}
