import { Injectable } from '@angular/core';

import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import moment, { Moment } from 'moment';

import { DE_FORMAT_STRING, EN_FORMAT_STRING, LOCALE_DE } from '../../constants';

type sortOrder = 'desc' | 'asc';

@Injectable({
  providedIn: 'root',
})
export class ComparatorService {
  /**
   * get Format String (DE or EN) depending on locale to transform the date correctly
   */
  private readonly format: string;

  constructor(private readonly localeService: TranslocoLocaleService) {
    // set the format string

    this.format =
      this.localeService.getLocale() === LOCALE_DE.id
        ? DE_FORMAT_STRING
        : EN_FORMAT_STRING;
  }

  /**
   * compares two date strings, that have been transformed by transloco date pipe and have
   * two digits for day, month and year
   * using the method as filter comparator the item will be returned in descending order
   *
   * @param a date a
   * @param b date b
   * @returns the comparison result
   */
  public compareTranslocoDateDesc = (a: string, b: string) =>
    this.compare(a, b, 'desc');

  /**
   * compares two date strings, that have been transformed by transloco date pipe and have
   * two digits for day, month and year
   * using the method as filter comparator the item will be returned in ascending order
   *
   * @param a date a
   * @param b date b
   * @returns the comparison result
   */
  public compareTranslocoDateAsc = (a: string, b: string) =>
    this.compare(a, b, 'asc');

  private compare(a: string, b: string, order: sortOrder): number {
    if (this.stringDatesInvalid(a, b)) {
      return 0;
    }
    if (this.onlyOneStringDateInvalid(a, b)) {
      return order === 'desc' ? -1 : 1;
    }
    if (this.onlyOneStringDateInvalid(b, a)) {
      return order === 'desc' ? 1 : -1;
    }

    const momA = moment(a, this.format);
    const momB = moment(b, this.format);

    if (momA.isSame(momB)) {
      return 0;
    }

    return order === 'asc'
      ? this.sortAsc(momA, momB)
      : this.sortDesc(momA, momB);
  }

  private stringDatesInvalid(a: string, b: string) {
    return (!a && !b) || (a === '-' && b === '-');
  }

  private onlyOneStringDateInvalid(a: string, b: string) {
    return (!a || a === '-') && b;
  }

  private sortAsc(momA: Moment, momB: Moment): number {
    return momA.isAfter(momB) ? 1 : -1;
  }

  private sortDesc(momA: Moment, momB: Moment): number {
    return momA.isAfter(momB) ? -1 : 1;
  }
}
