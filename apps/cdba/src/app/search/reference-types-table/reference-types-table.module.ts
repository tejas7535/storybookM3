import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { ReferenceTypesTableComponent } from './reference-types-table.component';
import { DetailViewButtonComponent } from './status-bar/detail-view-button/detail-view-button.component';

@NgModule({
  declarations: [ReferenceTypesTableComponent, DetailViewButtonComponent],
  imports: [
    SharedModule,
    AgGridModule.withComponents([]),
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
  exports: [ReferenceTypesTableComponent],
})
export class ReferenceTypesTableModule {}
