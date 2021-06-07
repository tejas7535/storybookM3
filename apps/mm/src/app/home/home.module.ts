import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DynamicFormsModule } from '@caeonline/dynamic-forms';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { ReactiveComponentModule } from '@ngrx/component';

import { DropdownInputModule } from '@schaeffler/dropdown-input';
import { HorizontalSeparatorModule } from '@schaeffler/horizontal-separator';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingSearchModule } from '../bearing-search/bearing-search.module';
import { ListMemberComponent } from '../member-controls/list-member.component';
import { SelectMemberComponent } from '../member-controls/select-member.component';
import { StringNumberMemberComponent } from '../member-controls/string-number-member.component';
import { PagesStepperModule } from '../pages-stepper/pages-stepper.module';
import { PictureCardListModule } from '../picture-card-list/picture-card-list.module';
import { ResultPageModule } from '../result-page/result-page.module';
import { LazyListLoaderService } from '../services/lazy-list-loader.service';
import { RuntimeRequesterService } from '../services/runtime-requester.service';
import { HttpLocaleInterceptor } from '../shared/interceptors/http-locale.interceptor';
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
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLocaleInterceptor,
      multi: true,
    },
  ],
})
export class HomeModule {}
