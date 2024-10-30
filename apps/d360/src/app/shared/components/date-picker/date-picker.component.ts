import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, ThemePalette } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';

import { AVAILABLE_LOCALES } from '../../constants/available-locales';

@Component({
  selector: 'app-date-picker',
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
  ],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  @Input() label!: string;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() color: ThemePalette = 'primary';
  @Input() hint!: string;
  @Input() errorMessage!: string;
  @Input() dateControl: FormControl = new FormControl('');

  constructor(private readonly _adapter: MomentDateAdapter) {}

  ngOnInit(): void {
    // TODO: Placeholder until the implementation of Locale Select
    this._adapter.setLocale(
      localStorage.getItem('locale') ?? AVAILABLE_LOCALES[0].id
    );
  }
}
