import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  DynamicFormsModule,
  LazyListLoaderService,
} from '@caeonline/dynamic-forms';

import { RuntimeRequesterService } from '../../core/services';
import {
  ListMemberComponent,
  StringNumberMemberComponent,
} from '../../shared/components/member-controls';
import { MemberTypes } from '../../shared/constants/dialog-constant';
import { SharedModule } from './../../shared/shared.module';
import { CalculationOptionsComponent } from './calculation-options.component';

@NgModule({
  declarations: [CalculationOptionsComponent],
  imports: [
    CommonModule,

    SharedModule,

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
