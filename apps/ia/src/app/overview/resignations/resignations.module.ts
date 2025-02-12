import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { SharedModule } from '../../shared/shared.module';
import { ResignationsComponent } from './resignations.component';

@NgModule({
  declarations: [ResignationsComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    AgGridModule,
    SharedPipesModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [ResignationsComponent],
})
export class ResignationsModule {}
