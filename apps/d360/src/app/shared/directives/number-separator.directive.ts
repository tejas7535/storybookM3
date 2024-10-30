import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';

/**
 * This Directive parses the input value of a given input field.
 * TODO: Extend to allow decimal, if needed.
 * Hint 1: Decimal is tricky, because if the user types a number in e.g. "100," will be send and the comma is a problem.
 * Hint 2: Decimal is only possible via copy paste atm. ;)
 *
 * @export
 * @class NumberSeparatorDirective
 */
@Directive({
  selector: '[appNumberSeparator]',
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
    const realValue = this.getNumberFromLocale(
      value,
      this.translocoLocaleService.getLocale()
    );

    // if the user was entering a non numeric string, we need to eliminate it
    if (Number.isNaN(realValue)) {
      return '';
    }

    return this.translocoLocaleService.localizeNumber(
      realValue,
      'decimal',
      this.translocoLocaleService.getLocale()
    );
  }

  /**
   * This method will 'unformat' a number that has been formatted to a locale string.
   *
   * Hint: It will return the unformatted number in case the conversion was successful,
   * otherwise it will return the original number using parseFloat to convert it to type number.
   * This could result in NaN!
   *
   * @private
   * @param {string} number
   * @param {string} locale
   * @return {number}
   * @memberof NumberSeparatorDirective
   */
  private getNumberFromLocale(number: string, locale: string): number {
    let unformatted: string = number;

    const parts: string[] | null = (1234.5)
      .toLocaleString(locale)
      .match(/(\D+)/g);

    if (parts) {
      unformatted = unformatted.replaceAll(parts[0], '');
      unformatted = unformatted.replaceAll(parts[1], '.');

      return Number.parseFloat(unformatted);
    }

    return Number.parseFloat(number);
  }
}
