import { Component, inject, Input, OnInit } from '@angular/core';
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

import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
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
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  private readonly adapter: MomentDateAdapter = inject(MomentDateAdapter);

  @Input() label!: string;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() color: ThemePalette = 'primary';
  @Input() hint!: string;
  @Input() errorMessage!: string;
  @Input() dateControl: FormControl = new FormControl('');

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.adapter.setLocale(this.translocoLocaleService.getLocale());
  }
}
