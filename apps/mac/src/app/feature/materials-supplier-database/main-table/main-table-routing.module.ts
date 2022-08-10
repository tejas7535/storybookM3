import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MACRoutes } from '@mac/shared/models';

import { MainTableComponent } from './main-table.component';

export enum MainTablePaths {
  BasePath = '',
}

const routes: MACRoutes = [
  { path: MainTablePaths.BasePath, component: MainTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTableRoutingModule {}
