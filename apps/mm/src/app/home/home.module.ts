import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DynamicFormsModule } from '@caeonline/dynamic-forms';
import { ReactiveComponentModule } from '@ngrx/component';

import { DropdownInputModule } from '@schaeffler/dropdown-input';
import { HorizontalSeparatorModule } from '@schaeffler/horizontal-separator';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingSearchModule } from '../bearing-search/bearing-search.module';
import { CalculationOptionsModule } from '../calculation-options/calculations-options.module';
import { ListMemberComponent } from '../member-controls/list-member.component';
import { SelectMemberComponent } from '../member-controls/select-member.component';
import { StringNumberMemberComponent } from '../member-controls/string-number-member.component';
import { PagesStepperModule } from '../pages-stepper/pages-stepper.module';
import { PictureCardListModule } from '../picture-card-list/picture-card-list.module';
import { ResultPageModule } from '../result-page/result-page.module';
import { LazyListLoaderService } from '../services/lazy-list-loader.service';
import { RuntimeRequesterService } from '../services/runtime-requester.service';
import { MemberTypes } from '../shared/constants/dialog-constant';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent,
    ListMemberComponent,
    StringNumberMemberComponent,
    SelectMemberComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedTranslocoModule,
    SharedModule,

    // NGRX
    ReactiveComponentModule,

    // Shared Libs
    DropdownInputModule,

    // MM Modules
    PagesStepperModule,
    BearingSearchModule,
    ResultPageModule,
    PictureCardListModule,
    LoadingSpinnerModule,
    HorizontalSeparatorModule,
    CalculationOptionsModule,

    // Angular Material
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

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
})
export class HomeModule {}
