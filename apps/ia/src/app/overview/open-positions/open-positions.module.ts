import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { SharedModule } from '../../shared/shared.module';
import { OpenPositionsComponent } from './open-positions.component';
import { OpenPositionsListModule } from './open-positions-list/open-positions-list.module';

@NgModule({
  declarations: [OpenPositionsComponent],
  imports: [
    SharedModule,
    SharedPipesModule,
    SharedTranslocoModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    OpenPositionsListModule,
    LoadingSpinnerModule,
  ],
  exports: [OpenPositionsComponent],
})
export class OpenPositionsModule {}
