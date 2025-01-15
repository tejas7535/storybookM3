import 'moment/locale/de';

import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { IFloatingFilterAngularComp } from 'ag-grid-angular';
import { FilterChangedEvent, IFloatingFilterParams } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';
@Component({
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    SharedTranslocoModule,
  ],
  selector: 'gq-custom-date-filter',
  templateUrl: './custom-date-floating-filter.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class CustomDateFloatingFilterComponent
  implements IFloatingFilterAngularComp, OnInit
{
  private params: IFloatingFilterParams;

  public dateFormControl = new FormControl();
  public applyDisabled = true;

  constructor(
    private readonly adapter: DateAdapter<any>,
    private readonly translocoLocaleService: TranslocoLocaleService
  ) {}

  ngOnInit(): void {
    const locale = this.translocoLocaleService.getLocale();

    this.adapter.setLocale(locale || 'en-US');
  }

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
    this.dateFormControl.valueChanges.subscribe((val) => {
      this.params.parentFilterInstance((instance: any) => {
        instance.takeValueFromFloatingFilter(val);
      });
    });
  }

  resetDate(): void {
    this.dateFormControl.setValue(undefined as any);
  }

  // required by the ag-grid interface
  onParentModelChanged(
    _parentModel: any,
    _filterChangedEvent?: FilterChangedEvent
  ): void {}
  afterGuiAttached(): void {}
}
