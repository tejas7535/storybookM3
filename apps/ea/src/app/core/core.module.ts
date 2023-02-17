import { NgModule } from '@angular/core';

import { StoreModule } from './store/store.module';

@NgModule({
  imports: [StoreModule],
  exports: [StoreModule],
})
export class CoreModule {}
