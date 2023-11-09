import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { OverviewCardComponent } from './overview-card.component';

@NgModule({
  declarations: [OverviewCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    PushPipe,
    RouterModule,
    SharedTranslocoModule,
  ],
  exports: [OverviewCardComponent],
})
export class OverviewCardModule {}
