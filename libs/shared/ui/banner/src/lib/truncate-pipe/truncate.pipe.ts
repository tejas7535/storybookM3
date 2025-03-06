import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: false,
})
export class TruncatePipe implements PipeTransform {
  /**
   * Transforms text to a truncated string
   * @param value         The input string
   * @param limit         The limit to which the string should be shortened
   * @param completeWords A boolean indicating if words may be split
   * @param ellipsis      A string which will be used to indicate text is shortened
   */
  public transform(
    value: string,
    limit: number,
    completeWords = false,
    ellipsis = '...'
  ): string {
    let stringLimit = limit;

    if (completeWords) {
      stringLimit = value.slice(0, stringLimit).lastIndexOf(' ');
    }

    return limit > value.length
      ? `${value.slice(0, stringLimit)}`
      : `${value.slice(0, stringLimit)} ${ellipsis}`;
  }
}
