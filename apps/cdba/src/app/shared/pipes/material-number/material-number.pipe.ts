import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'materialNumber',
  standalone: false,
})
export class MaterialNumberPipe implements PipeTransform {
  transform(value: string): string {
    let materialNumber: string;

    if (value) {
      switch (value.length) {
        case 13: {
          materialNumber = `${value.slice(0, 9)}-${value.slice(9)}`;
          break;
        }
        case 15: {
          materialNumber = `${value.slice(0, 9)}-${value.slice(
            9,
            13
          )}-${value.slice(13)}`;
          break;
        }
        default: {
          materialNumber = value;
        }
      }
    }

    return materialNumber;
  }
}
