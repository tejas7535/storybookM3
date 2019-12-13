import { NgModule } from '@angular/core';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import { reducer } from './reducers';

@NgModule({
  imports: [NgrxStoreModule.forFeature('banner', reducer)],
  exports: []
})
export class StoreModule {}
