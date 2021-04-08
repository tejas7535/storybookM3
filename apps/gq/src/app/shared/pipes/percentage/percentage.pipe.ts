import { Pipe, PipeTransform } from '@angular/core';

import { HelperService } from '../../services/helper-service/helper-service.service';

@Pipe({
  name: 'percentage',
})
export class PercentagePipe implements PipeTransform {
  transform(value: number): string {
    return HelperService.transformPercentage(value);
  }
}
