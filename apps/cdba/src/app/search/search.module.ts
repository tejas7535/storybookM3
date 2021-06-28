import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    BlockUiModule,
    SharedTranslocoModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'search' }],
})
export class SearchModule {}
