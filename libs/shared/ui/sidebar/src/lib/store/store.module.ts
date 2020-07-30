import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import { SidebarEffects } from './effects/sidebar.effects';
import { reducer } from './reducers/sidebar.reducer';

@NgModule({
  imports: [
    NgrxStoreModule.forFeature('sidebar', reducer),
    EffectsModule.forFeature([SidebarEffects]),
  ],
  exports: [],
})
export class StoreModule {}
