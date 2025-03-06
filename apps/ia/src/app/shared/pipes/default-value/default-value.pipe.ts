import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultValue',
  standalone: false,
})
export class DefaultValuePipe implements PipeTransform {
  transform(value: unknown, suffix?: string): string {
    // check if a suffix is added
    const suffixString = suffix === undefined ? '' : suffix;

    // concatenate correct return value
    const returnValue =
      value !== undefined && value !== null ? `${value} ${suffixString}` : '-';

    // trim return value if suffix is not available
    return returnValue.trim();
  }
}
