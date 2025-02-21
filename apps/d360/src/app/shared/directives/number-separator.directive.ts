import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import {
  getDecimalSeparator,
  getNumberFromLocale,
  numberIsAtStartOfDecimal,
} from '../utils/number';

/**
 * This Directive parses the input value of a given input field.
 * Use the directive's input variables to allow decimal places or negative numbers.
 *
 * @export
 * @class NumberSeparatorDirective
 */
@Directive({
  selector: '[d360NumberSeparator]',
  standalone: true,
})
export class NumberSeparatorDirective implements OnInit {
  /**
   * The ElementRef instance.
   *
   * @private
   * @type {ElementRef}
   * @memberof NumberSeparatorDirective
   */
  private readonly elementRef: ElementRef = inject(ElementRef);

  /**
   * The NgControl instance.
   *
   * @private
   * @type {NgControl}
   * @memberof NumberSeparatorDirective
   */
  private readonly ngControl: NgControl = inject(NgControl);

  /**
   * The TranslocoLocaleService instance.
   *
   * @private
   * @type {TranslocoLocaleService}
   * @memberof NumberSeparatorDirective
   */
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  public readonly allowDecimalPlaces = input(false);
  public readonly allowNegativeNumbers = input(false);

  /**
   * Because of formatted strings we need to allow text only.
   *
   * @memberof NumberSeparatorDirective
   */
  public ngOnInit(): void {
    // we need to fix the field, if someone chose number instead.
    this.elementRef.nativeElement.type = 'text';
  }

  /**
   * Parse the Input values.
   *
   * @memberof NumberSeparatorDirective
   */
  @HostListener('input', ['$event'])
  public onInput(): void {
    this.ngControl?.control?.patchValue(
      this.getFormattedValue(this.elementRef.nativeElement.value),
      { emitEvent: false, onlySelf: true }
    );
  }

  /**
   * Returns the formatted value.
   *
   * @param {*} value
   * @returns {string}
   * @memberof NumberSeparatorDirective
   */
  public getFormattedValue(value: any): string {
    // clean up number
    const realValue = getNumberFromLocale(
      value,
      this.translocoLocaleService.getLocale()
    );

    if (this.allowNegativeNumbers() && value === '-') {
      return '-';
    }

    const wasUserAboutToEnterDecimal = numberIsAtStartOfDecimal(
      value,
      this.translocoLocaleService.getLocale()
    );

    // if the user was entering a non numeric string, we need to eliminate it
    if (Number.isNaN(realValue)) {
      return '';
    }

    const formattedNumber = this.translocoLocaleService.localizeNumber(
      realValue,
      'decimal',
      this.translocoLocaleService.getLocale(),
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: this.allowDecimalPlaces ? 2 : 0,
      }
    );

    return (
      formattedNumber +
      this.conditionallyAppendDecimalSeparator(wasUserAboutToEnterDecimal)
    );
  }

  private conditionallyAppendDecimalSeparator(
    wasUserAboutToEnterDecimal: boolean
  ) {
    return this.allowDecimalPlaces() && wasUserAboutToEnterDecimal
      ? getDecimalSeparator(this.translocoLocaleService.getLocale())
      : '';
  }
}
