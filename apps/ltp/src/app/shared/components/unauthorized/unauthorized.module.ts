import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@ngneat/transloco';

import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  declarations: [UnauthorizedComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    TranslocoModule,
    RouterModule
  ],
  exports: [UnauthorizedComponent]
})
export class UnauthorizedModule {}
