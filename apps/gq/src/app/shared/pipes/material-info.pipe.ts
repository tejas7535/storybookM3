import { Pipe, PipeTransform } from '@angular/core';

import { MaterialDetails } from '../../core/store/models';

@Pipe({
  name: 'materialInfo',
})
export class MaterialInfoPipe implements PipeTransform {
  transform(value: MaterialDetails): string {
    return `| ${value.materialNumber15} | ${value.materialDescription}`;
  }
}
