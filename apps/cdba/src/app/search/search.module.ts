import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchEffects } from '@cdba/core/store/effects/search/search.effects';
import { BlockUiModule } from '@cdba/shared/components';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ReferenceTypesFiltersModule } from './reference-types-filters/reference-types-filters.module';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
    SearchRoutingModule,
    EffectsModule.forFeature([SearchEffects]),
    ReferenceTypesFiltersModule,
    BlockUiModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'search' }],
})
export class SearchModule {}
