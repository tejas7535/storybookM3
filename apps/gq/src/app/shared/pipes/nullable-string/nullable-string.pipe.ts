import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullableString',
})
export class NullableStringPipe implements PipeTransform {
  transform(value: string): string {
    return value && value.length > 0 ? value : '-';
  }
}
