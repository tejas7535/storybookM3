import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
})
export class NumberFormatPipe implements PipeTransform {
  transform(number: number, colId: string): string {
    const digits = colId !== 'orderQuantity';
    const pipe = new DecimalPipe('en');

    return pipe.transform(number, digits ? '.2-2' : '');
  }
}
