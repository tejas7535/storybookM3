import { Pipe, PipeTransform } from '@angular/core';

import { MaterialNumberService } from '../../services/material-number/material-number.service';

@Pipe({
  name: 'materialTransform',
})
export class MaterialTransformPipe implements PipeTransform {
  constructor(private readonly materialNumberService: MaterialNumberService) {}

  transform(value: string): string {
    return this.materialNumberService.formatStringAsMaterialNumber(value);
  }
}
