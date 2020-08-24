import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DateRangeComponent } from './date-range.component';

// import { EffectsModule } from '@ngrx/effects';
// import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [DateRangeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // UI Modules
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,

    // Translation
    SharedTranslocoModule,

    // Store
    // EffectsModule.forFeature([BearingEffects]),
    // StoreModule.forFeature('bearing', bearingReducer),
  ],
  exports: [DateRangeComponent],
})
export class DateRangeModule {}
