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
import { MemberTypes } from '../shared/constants/dialog-constant';

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
        [MemberTypes.Boolean]: ListMemberComponent,
        [MemberTypes.List]: ListMemberComponent,
        [MemberTypes.RefList]: ListMemberComponent,
        [MemberTypes.LazyList]: ListMemberComponent,
        [MemberTypes.Number]: StringNumberMemberComponent,
        // string: StringNumberMemberComponent,
      },
      lazyListLoader: LazyListLoaderService,
      runtimeRequester: RuntimeRequesterService,
    }),
  ],
  exports: [CalculationOptionsComponent],
})
export class CalculationOptionsModule {}
