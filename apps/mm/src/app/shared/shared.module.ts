import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LetModule, PushModule } from '@ngrx/component';

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
import { MmNumberPipe } from './pipes/mm-number.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    LetModule,
    PushModule,
    PictureCardModule,
    LoadingSpinnerModule,
    MaterialModule,
    SelectModule,
  ],
  exports: [
    CommonModule,
    MmNumberPipe,
    FormsModule,
    ReactiveFormsModule,
    PictureCardModule,
    PictureCardListComponent,
    ListMemberComponent,
    SelectMemberComponent,
    StringNumberMemberComponent,
    LetModule,
    PushModule,
    MagneticSliderComponent,
    LoadingSpinnerModule,
    MaterialModule,
    SharedTranslocoModule,
    SelectModule,
  ],
  declarations: [
    MmNumberPipe,
    ListMemberComponent,
    SelectMemberComponent,
    StringNumberMemberComponent,
    MagneticSliderComponent,
    PictureCardListComponent,
  ],
})
export class SharedModule {}
