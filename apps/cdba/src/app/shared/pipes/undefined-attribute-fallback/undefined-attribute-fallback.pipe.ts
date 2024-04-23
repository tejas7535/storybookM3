import { Pipe, PipeTransform } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'undefinedAttributeFallback',
})
export class UndefinedAttributeFallbackPipe implements PipeTransform {
  constructor(private readonly translocoService: TranslocoService) {}

  transform(value: string): string {
    return (
      value || this.translocoService.translate('shared.undefinedAttribute')
    );
  }
}
