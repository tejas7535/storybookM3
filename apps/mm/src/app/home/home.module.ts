import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DynamicFormsModule } from '@caeonline/dynamic-forms';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { ReactiveComponentModule } from '@ngrx/component';

import { DropdownInputModule } from '@schaeffler/dropdown-input';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingSearchModule } from '../bearing-search/bearing-search.module';
import { ListMemberComponent } from '../member-controls/list-member.component';
import { StringNumberMemberComponent } from '../member-controls/string-number-member.component';
import { PagesStepperModule } from '../pages-stepper/pages-stepper.module';
import { PictureCardListModule } from '../picture-card-list/picture-card-list.module';
import { ResultPageModule } from '../result-page/result-page.module';
import { LazyListLoaderService } from '../services/lazy-list-loader.service';
import { RuntimeRequesterService } from '../services/runtime-requester.service';
import { SharedModule } from '../shared/shared.module';
import { SelectMemberComponent } from './../member-controls/select-member.component';
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

    // Angular Material
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

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

    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),
  ],
})
export class HomeModule {}
