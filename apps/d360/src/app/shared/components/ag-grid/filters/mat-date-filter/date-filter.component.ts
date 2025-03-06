import { Component, ElementRef, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { IDateAngularComp } from 'ag-grid-angular';
import type { IDateParams } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ValidationHelper } from '../../../../utils/validation/validation-helper';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    SharedTranslocoModule,
  ],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss',
})
export class DateFilterComponent implements IDateAngularComp {
  private readonly mdcInput = viewChild.required('mdcInput', {
    read: ElementRef,
  });

  protected control: FormControl<Date | null> = new FormControl<Date | null>(
    null
  );

  protected placeholder: string =
    ValidationHelper.getDateFormat().toLocaleLowerCase();

  private params!: IDateParams;

  public agInit(params: IDateParams): void {
    this.params = params;
  }

  public onDateChanged(): void {
    this.params.onDateChanged();
  }

  public getDate(): Date {
    return this.control.value;
  }

  public setDate(date: Date): void {
    this.control.setValue(date || null);
  }

  public setInputPlaceholder(): void {
    this.mdcInput().nativeElement.setAttribute('placeholder', this.placeholder);
  }

  public setInputAriaLabel(label: string): void {
    this.mdcInput().nativeElement.setAttribute('aria-label', label);
  }
}
