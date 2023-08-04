import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { RangeFilterComponent } from './range-filter.component';
import { RangeFilterValuePipe } from './range-filter-value.pipe';

@NgModule({
  declarations: [RangeFilterComponent, RangeFilterValuePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PushPipe,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    SharedTranslocoModule,
    MatListModule,
  ],
  exports: [RangeFilterComponent],
})
export class RangeFilterModule {}
