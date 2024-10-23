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
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import { InfoIconModule } from '@gq/shared/components/info-icon/info-icon.module';
import { DATE_FORMATS } from '@gq/shared/constants/date-formats';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HeaderContentComponent } from './header-content.component';
import { QuotationNoteIconComponent } from './quotation-note/icon/quotation-note-icon.component';

@NgModule({
  declarations: [HeaderContentComponent],
  imports: [
    InfoIconModule,
    MatIconModule,
    MatButtonModule,
    SharedTranslocoModule,
    PushPipe,
    ReactiveFormsModule,
    MatDatepickerModule,
    SharedTranslocoModule,
    SharedDirectivesModule,
    CommonModule,
    MatDialogModule,
    QuotationNoteIconComponent,
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
