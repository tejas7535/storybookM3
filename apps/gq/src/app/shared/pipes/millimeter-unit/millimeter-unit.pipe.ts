import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millimeterUnit',
})
export class MillimeterUnitPipe implements PipeTransform {
  transform(value: string): string {
    return value ? `${value}mm` : '-';
  }
}
