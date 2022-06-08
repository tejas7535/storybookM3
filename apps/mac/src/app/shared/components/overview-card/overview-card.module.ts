import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { PushModule } from '@ngrx/component';

import { OverviewCardComponent } from './overview-card.component';

@NgModule({
  declarations: [OverviewCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    PushModule,
    RouterModule,
  ],
  exports: [OverviewCardComponent],
})
export class OverviewCardModule {}
