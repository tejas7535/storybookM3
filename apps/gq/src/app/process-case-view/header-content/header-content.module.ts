import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../shared/components/info-icon/info-icon.module';
import { SharedDirectivesModule } from '../../shared/directives/shared-directives.module';
import { HeaderContentComponent } from './header-content.component';

// needed to display leading zeros
export const DATE_FORMATS = {
  parse: { ...MAT_MOMENT_DATE_FORMATS.parse },
  display: {
    ...MAT_MOMENT_DATE_FORMATS.display,
    dateInput: 'L',
  },
};
@NgModule({
  declarations: [HeaderContentComponent],
  imports: [
    InfoIconModule,
    MatIconModule,
    MatButtonModule,
    SharedTranslocoModule,
    PushModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    SharedTranslocoModule,
    SharedDirectivesModule,
    CommonModule,
    MatDialogModule,
  ],
  exports: [HeaderContentComponent],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'process-case-view' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
})
export class HeaderContentModule {}
