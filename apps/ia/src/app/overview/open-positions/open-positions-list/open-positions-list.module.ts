import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

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
    MatChipsModule,
  ],
  exports: [OpenPositionsListComponent],
})
export class OpenPositionsListModule {}
