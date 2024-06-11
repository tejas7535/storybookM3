import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SelectModule } from '@schaeffler/inputs/select';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { PictureCardModule } from '@schaeffler/picture-card';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MagneticSliderComponent } from './components/magnetic-slider/magnetic-slider.component';
import {
  ListMemberComponent,
  PictureCardListComponent,
  SelectMemberComponent,
  StringNumberMemberComponent,
} from './components/member-controls';
import { MaterialModule } from './material.module';
import { MmHostMappingPipe } from './pipes/mm-host-mapping.pipe';
import { MmNumberPipe } from './pipes/mm-number.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    LetDirective,
    PushPipe,
    PictureCardModule,
    LoadingSpinnerModule,
    MaterialModule,
    SelectModule,
  ],
  exports: [
    CommonModule,
    MmNumberPipe,
    MmHostMappingPipe,
    FormsModule,
    ReactiveFormsModule,
    PictureCardModule,
    PictureCardListComponent,
    ListMemberComponent,
    SelectMemberComponent,
    StringNumberMemberComponent,
    LetDirective,
    PushPipe,
    MagneticSliderComponent,
    LoadingSpinnerModule,
    MaterialModule,
    SharedTranslocoModule,
    SelectModule,
  ],
  declarations: [
    MmNumberPipe,
    MmHostMappingPipe,
    ListMemberComponent,
    SelectMemberComponent,
    StringNumberMemberComponent,
    MagneticSliderComponent,
    PictureCardListComponent,
  ],
})
export class SharedModule {}
