import { Pipe, PipeTransform } from '@angular/core';

import { MaterialDetails } from '../../core/store/models';
import { MaterialTransformPipe } from './material-transform.pipe';

@Pipe({
  name: 'materialInfo',
})
export class MaterialInfoPipe implements PipeTransform {
  transform(value: MaterialDetails): string {
    const materialPipe = new MaterialTransformPipe();

    return `| ${materialPipe.transform(value.materialNumber15)} | ${
      value.materialDescription
    }`;
  }
}
