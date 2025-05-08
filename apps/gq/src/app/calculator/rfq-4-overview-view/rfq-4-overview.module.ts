import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';

import { Rfq4OverviewFacade } from './store/rfq-4-overview.facade';
import { Rfq4OverviewStore } from './store/rfq-4-overview.store';

@NgModule({
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'rfq-4-overview', multi: true },
    Rfq4OverviewStore,
    Rfq4OverviewFacade,
  ],
})
export class Rfq4OverviewModule {}
