import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { FilterPanelModule } from './filter-panel/filter-panel.module';
import { ReferenceTypesFiltersModule } from './reference-types-filters/reference-types-filters.module';
import { ReferenceTypesTableModule } from './reference-types-table/reference-types-table.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    SharedModule,
    SearchRoutingModule,
    FilterPanelModule,
    ReferenceTypesFiltersModule,
    ReferenceTypesTableModule,
  ],
})
export class SearchModule {}
