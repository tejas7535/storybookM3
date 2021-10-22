import { Pipe, PipeTransform } from '@angular/core';

import { MaterialDetails } from '../../models/quotation-detail';
import { MaterialTransformPipe } from '../material-transform/material-transform.pipe';

@Pipe({
  name: 'materialInfo',
})
export class MaterialInfoPipe implements PipeTransform {
  constructor(private readonly materialTransformPipe: MaterialTransformPipe) {}

  transform(value: MaterialDetails): string {
    return `${this.materialTransformPipe.transform(value.materialNumber15)} | ${
      value.materialDescription
    }`;
  }
}
