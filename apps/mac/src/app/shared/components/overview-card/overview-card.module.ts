import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
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
