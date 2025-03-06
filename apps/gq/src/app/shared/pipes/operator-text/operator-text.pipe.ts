import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'operatorText',
})
export class OperatorTextPipe implements PipeTransform {
  transform(value: number): string {
    return value < 0 ? '-' : '+';
  }
}
