import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CaseViewComponent } from './case-view.component';
import { CaseViewRoutePath } from './case-view-route-path.enum';

const routes: Routes = [
  {
    path: CaseViewRoutePath.BasePath,
    children: [
      {
        path: CaseViewRoutePath.ActiveTabPath,
        component: CaseViewComponent,
        pathMatch: 'full',
      },
      {
        path: '**',
        component: CaseViewComponent,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseViewRoutingModule {}
