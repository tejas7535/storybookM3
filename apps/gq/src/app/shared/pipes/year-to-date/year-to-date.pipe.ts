import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yearToDate',
  standalone: false,
})
export class YearToDatePipe implements PipeTransform {
  /**
   * Transforms a year into the date of the first of january of that year.
   *
   * @param year the year
   * @returns the date
   */
  transform(year: number): Date {
    return new Date(year, 0, 1);
  }
}
