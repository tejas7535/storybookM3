import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SearchEffects } from '../core/store/effects/search/search.effects';
import { searchReducer } from '../core/store/reducers/search/search.reducer';
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
    StoreModule.forFeature('search', searchReducer),
    EffectsModule.forFeature([SearchEffects]),
  ],
})
export class SearchModule {}
