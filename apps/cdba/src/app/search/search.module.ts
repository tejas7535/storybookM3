import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SearchEffects } from '@cdba/core/store/effects/search/search.effects';
import { BlockUiModule } from '@cdba/shared/components';

import { SharedModule } from '../shared/shared.module';
import { ReferenceTypesFiltersModule } from './reference-types-filters/reference-types-filters.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    SharedModule,
    SearchRoutingModule,
    ReferenceTypesFiltersModule,
    EffectsModule.forFeature([SearchEffects]),
    BlockUiModule,
    SharedTranslocoModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'search' }],
})
export class SearchModule {}
