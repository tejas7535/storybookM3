import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared/shared.module';
import { TabsHeaderModule } from '../shared/tabs-header/tabs-header.module';
import { BomTabModule } from './bom-tab/bom-tab.module';
import { CompareRoutingModule } from './compare-routing.module';
import { CompareComponent } from './compare.component';
import { DetailsTabModule } from './details-tab/details-tab.module';

@NgModule({
  declarations: [CompareComponent],
  imports: [
    SharedModule,
    CompareRoutingModule,
    DetailsTabModule,
    BomTabModule,
    SharedTranslocoModule,
    TabsHeaderModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'compare' }],
})
export class CompareModule {}
