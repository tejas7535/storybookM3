import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  ThemePalette,
} from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { addMonths, subMonths } from 'date-fns';
import moment, { Moment } from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MM.YYYY', // this is the format showing on the input element
    monthYearLabel: 'MM.YYYY', // this is showing on the calendar
  },
};

@Component({
  selector: 'app-date-picker-month-year',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideMomentDateAdapter(),
    {
      provide: MomentDateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  templateUrl: './date-picker-month-year.component.html',
  styleUrls: ['./date-picker-month-year.component.scss'],
})
export class DatePickerMonthYearComponent implements OnInit {
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  private readonly adapter: MomentDateAdapter = inject(MomentDateAdapter);

  @Input() placeholder!: string;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() color: ThemePalette = 'primary';
  @Input() hint!: string;
  @Input() errorMessage!: string;
  @Input() dateControl: FormControl = new FormControl('');

  @Input() endOf = false;

  public readonly lastViewableDate: WritableSignal<Date> = signal(
    addMonths(new Date(), 36)
  );
  public readonly firstViewableDate: WritableSignal<Date> = signal(
    subMonths(new Date(), 36)
  );

  ngOnInit(): void {
    this.adapter.setLocale(this.translocoLocaleService.getLocale());
  }

  onSelectMonth(event: any, datepicker: MatDatepicker<Moment>) {
    if (this.endOf) {
      this.dateControl.setValue(moment(event).endOf('month'));
    } else {
      this.dateControl.setValue(moment(event).startOf('month'));
    }

    datepicker.close();
  }
}
