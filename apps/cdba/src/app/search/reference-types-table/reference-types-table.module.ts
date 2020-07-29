import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { BomViewButtonComponent } from '../../shared/table/custom-status-bar/bom-view-button/bom-view-button.component';
import { CustomStatusBarModule } from '../../shared/table/custom-status-bar/custom-status-bar.module';
import { DetailViewButtonComponent } from '../../shared/table/custom-status-bar/detail-view-button/detail-view-button.component';
import { ReferenceTypesTableComponent } from './reference-types-table.component';

@NgModule({
  declarations: [ReferenceTypesTableComponent],
  imports: [
    SharedModule,
    AgGridModule.withComponents([
      DetailViewButtonComponent,
      BomViewButtonComponent,
    ]),
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
    CustomStatusBarModule,
  ],
  exports: [ReferenceTypesTableComponent],
})
export class ReferenceTypesTableModule {}
