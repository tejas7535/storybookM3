import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  declarations: [UnauthorizedComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    TranslateModule,
    RouterModule
  ],
  exports: [UnauthorizedComponent]
})
export class UnauthorizedModule {}
