import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'materialInfo',
})
export class MaterialInfoPipe implements PipeTransform {
  transform(value: any): string {
    return `| ${value.materialNumber15} | ${value.materialDescription}`;
  }
}
