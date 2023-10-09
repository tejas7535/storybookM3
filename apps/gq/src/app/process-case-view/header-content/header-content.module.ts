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
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import { InfoIconModule } from '@gq/shared/components/info-icon/info-icon.module';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    PushPipe,
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
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
})
export class HeaderContentModule {}
