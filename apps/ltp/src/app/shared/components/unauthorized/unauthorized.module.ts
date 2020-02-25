import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';

import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  declarations: [UnauthorizedComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    SharedTranslocoModule,
    RouterModule
  ],
  exports: [UnauthorizedComponent]
})
export class UnauthorizedModule {}
