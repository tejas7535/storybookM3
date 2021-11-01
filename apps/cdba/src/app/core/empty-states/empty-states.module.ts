import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { RoleDescriptionsModule } from '@cdba/shared/components/role-descriptions/role-descriptions.module';

import { EmptyStatesRoutingModule } from './empty-states-routing.module';
import { EmptyStatesComponent } from './components/empty-states.component';

@NgModule({
  imports: [
    // shared functional modules
    SharedTranslocoModule,

    // ui modules
    RoleDescriptionsModule,
    EmptyStatesRoutingModule,
  ],
  declarations: [EmptyStatesComponent],
})
export class EmptyStatesModule {}
