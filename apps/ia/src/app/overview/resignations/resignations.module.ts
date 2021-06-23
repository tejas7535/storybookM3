import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { SharedModule } from '../../shared/shared.module';
import { ResignationsComponent } from './resignations.component';

@NgModule({
  declarations: [ResignationsComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([]),
    SharedPipesModule,
  ],
  exports: [ResignationsComponent],
})
export class ResignationsModule {}
