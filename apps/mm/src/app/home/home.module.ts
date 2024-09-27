import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DynamicFormsModule } from '@caeonline/dynamic-forms';
import { PagesStepperComponent } from '@mm/core/components/pages-stepper/pages-stepper.component';
import { ENV, getEnv } from '@mm/environments/environments.provider';
import { AppStoreButtonsComponent } from '@mm/shared/components/app-store-buttons/app-store-buttons.component';
import { HorizontalSeparatorComponent } from '@mm/shared/components/horizontal-seperator/horizontal-separator.component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import {
  LazyListLoaderService,
  RuntimeRequesterService,
} from '../core/services';
import {
  ListMemberComponent,
  StringNumberMemberComponent,
} from '../shared/components/member-controls';
import { MemberTypes } from '../shared/constants/dialog-constant';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from './../core/core.module';
import { BearingSearchComponent } from './bearing-search/bearing-search.component';
import { CalculationOptionsModule } from './calculation-options/calculations-options.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ReportResultPageComponent } from './report-result-page/report-result-page.component';
import { ResultPageModule } from './result-page/result-page.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    CoreModule,

    // MM Modules
    BearingSearchComponent,
    ResultPageModule,
    LoadingSpinnerModule,
    HorizontalSeparatorComponent,
    CalculationOptionsModule,
    AppStoreButtonsComponent,
    ReportResultPageComponent,
    PagesStepperComponent,

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
  providers: [
    {
      provide: ENV,
      useFactory: getEnv,
    },
  ],
})
export class HomeModule {}
