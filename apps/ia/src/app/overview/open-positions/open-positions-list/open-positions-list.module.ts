import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { SharedModule } from '../../../shared/shared.module';
import { OpenPositionsListComponent } from './open-positions-list.component';

@NgModule({
  declarations: [OpenPositionsListComponent],
  imports: [
    SharedModule,
    SharedPipesModule,
    SharedTranslocoModule,
    MatListModule,
    MatDividerModule,
    MatBadgeModule,
    MatIconModule,
    LoadingSpinnerModule,
  ],
  exports: [OpenPositionsListComponent],
})
export class OpenPositionsListModule {}
