import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { BomViewButtonComponent } from '../../../shared/table/custom-status-bar/bom-view-button/bom-view-button.component';
import { CustomStatusBarModule } from '../../../shared/table/custom-status-bar/custom-status-bar.module';
import { DetailViewButtonComponent } from '../../../shared/table/custom-status-bar/detail-view-button/detail-view-button.component';
import { CalculationsTableComponent } from './calculations-table.component';

@NgModule({
  declarations: [CalculationsTableComponent],
  imports: [
    SharedModule,
    CustomStatusBarModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([
      DetailViewButtonComponent,
      BomViewButtonComponent,
    ]),
    MatCardModule,
  ],
  exports: [CalculationsTableComponent],
})
export class CalculationsTableModule {}
