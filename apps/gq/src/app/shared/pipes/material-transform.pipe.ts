import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'materialTransform',
})
export class MaterialTransformPipe implements PipeTransform {
  transform(value: string): string {
    const transformed =
      value.length === 15
        ? `${value.slice(0, 9)}-${value.slice(9, 13)}-${value.slice(13)}`
        : value;

    return transformed;
  }
}
