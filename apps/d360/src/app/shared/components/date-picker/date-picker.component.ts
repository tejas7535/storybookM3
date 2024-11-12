import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import moment, { isMoment, Moment } from 'moment';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'd360-date-picker',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
  ],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  private readonly adapter: DateAdapter<Moment> = inject(DateAdapter<Moment>);

  protected label: InputSignal<string> = input('');
  protected control: InputSignal<FormControl> = input(new FormControl(''));
  protected hint: InputSignal<string> = input('');
  protected errorMessage: InputSignal<string> = input('');
  protected minDate: InputSignal<Date> = input(new Date('1900-01-01T00:00:00'));
  protected maxDate: InputSignal<Date> = input(new Date('9999-12-31T23:59:59'));
  protected appearance: InputSignal<MatFormFieldAppearance> =
    input<MatFormFieldAppearance>('outline');

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.adapter.setLocale(this.translocoLocaleService.getLocale());

    // convert to moment
    const value = this.control().getRawValue();
    if (value && !isMoment(value)) {
      this.control().setValue(moment(value));
    }
  }
}
