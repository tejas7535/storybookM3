import { Pipe, PipeTransform } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'undefinedValue',
  standalone: false,
})
export class UndefinedValuePipe implements PipeTransform {
  public constructor(private readonly translocoService: TranslocoService) {}

  public transform(value: number | string): number | string {
    return (
      value ||
      this.translocoService.translate('calculationResult.undefinedValue')
    );
  }
}
