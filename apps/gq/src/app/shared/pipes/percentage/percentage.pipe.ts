import { Pipe, PipeTransform } from '@angular/core';

import { TransformationService } from '@gq/shared/services/transformation/transformation.service';

@Pipe({
  name: 'percentage',
})
export class PercentagePipe implements PipeTransform {
  constructor(private readonly transformationService: TransformationService) {}

  transform(
    value: number,
    isPercentageFormat: boolean = true,
    keepValue: boolean = false
  ): string {
    return this.transformationService.transformPercentage(
      value,
      isPercentageFormat,
      keepValue
    );
  }
}
