import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SearchEffects } from '../core/store/effects';
import { searchReducer } from '../core/store/reducers/search/search.reducer';
import { BlockUiModule } from '../shared/block-ui/block-ui.module';
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
    BlockUiModule,
    SharedTranslocoModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'search' }],
})
export class SearchModule {}
