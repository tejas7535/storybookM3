import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

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
    OpenPositionsListModule,
    LoadingSpinnerModule,
  ],
  exports: [OpenPositionsComponent],
})
export class OpenPositionsModule {}
