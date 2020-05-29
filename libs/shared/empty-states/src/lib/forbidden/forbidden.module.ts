import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ForbiddenComponent } from './forbidden.component';

const routes = [
  {
    path: '',
    component: ForbiddenComponent,
  },
];

@NgModule({
  declarations: [ForbiddenComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule.forChild(routes),
  ],
})
export class ForbiddenModule {}
