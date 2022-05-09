import { Pipe, PipeTransform } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';

@Pipe({
  name: 'undefinedValue',
})
export class UndefinedValuePipe implements PipeTransform {
  public constructor(private readonly translocoService: TranslocoService) {}

  public transform(value: number | string): number | string {
    return value || this.translocoService.translate('undefinedValue');
  }
}
