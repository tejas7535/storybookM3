import { Pipe, PipeTransform } from '@angular/core';

import { MaterialDetails } from '../../models/quotation-detail/material';
import { MaterialNumberService } from '../../services/material-number/material-number.service';

@Pipe({
  name: 'materialInfo',
  standalone: false,
})
export class MaterialInfoPipe implements PipeTransform {
  constructor(private readonly materialNumberService: MaterialNumberService) {}

  transform(value: MaterialDetails): string {
    return `${this.materialNumberService.formatStringAsMaterialNumber(
      value.materialNumber15
    )} | ${value.materialDescription}`;
  }
}
