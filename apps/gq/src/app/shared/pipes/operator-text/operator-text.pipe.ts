import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'operatorText',
  standalone: true,
})
export class OperatorTextPipe implements PipeTransform {
  transform(value: number): string {
    return value < 0 ? '-' : '+';
  }
}
