import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  DynamicFormsModule,
  LazyListLoaderService,
} from '@caeonline/dynamic-forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { ListMemberComponent } from '../member-controls/list-member.component';
import { StringNumberMemberComponent } from '../member-controls/string-number-member.component';
import { RuntimeRequesterService } from '../services/runtime-requester.service';

import { CalculationOptionsComponent } from './calculation-options.component';

@NgModule({
  declarations: [CalculationOptionsComponent],
  imports: [
    CommonModule,
    ReactiveComponentModule,
    MatIconModule,
    MatExpansionModule,

    // Dynamic Forms
    DynamicFormsModule.forRoot({
      mapping: {
        boolean: ListMemberComponent,
        list: ListMemberComponent,
        'ref-list': ListMemberComponent,
        'lazy-list': ListMemberComponent,
        number: StringNumberMemberComponent,
        // string: StringNumberMemberComponent,
      },
      lazyListLoader: LazyListLoaderService,
      runtimeRequester: RuntimeRequesterService,
    }),
  ],
  exports: [CalculationOptionsComponent],
})
export class CalculationOptionsModule {}
