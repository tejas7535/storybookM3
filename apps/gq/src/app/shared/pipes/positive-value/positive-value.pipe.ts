import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'positiveValue',
  standalone: true,
})
export class PositiveValuePipe implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value);
  }
}
