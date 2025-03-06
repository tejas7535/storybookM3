import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'positiveValue',
})
export class PositiveValuePipe implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value);
  }
}
