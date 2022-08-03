import { Pipe, PipeTransform } from '@angular/core';

import { HelperService } from '../../services/helper-service/helper-service.service';

@Pipe({
  name: 'percentage',
})
export class PercentagePipe implements PipeTransform {
  constructor(private readonly helperService: HelperService) {}

  transform(value: number): string {
    return this.helperService.transformPercentage(value);
  }
}
