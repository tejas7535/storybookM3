import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ReferenceTypesTableComponent } from './reference-types-table.component';

@NgModule({
  declarations: [ReferenceTypesTableComponent],
  imports: [SharedModule],
  exports: [ReferenceTypesTableComponent],
})
export class ReferenceTypesTableModule {}
