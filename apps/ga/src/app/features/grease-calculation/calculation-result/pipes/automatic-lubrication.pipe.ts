import { Pipe, PipeTransform } from '@angular/core';

import { LabelValue } from '@schaeffler/label-value';

import { environment } from '@ga/environments/environment';

import { CONCEPT1 } from '../models';

@Pipe({ name: 'automaticLubrication', standalone: true })
export class AutomaticLubricationPipe implements PipeTransform {
  public isProduction = environment.production;

  public transform(values: LabelValue[], active: boolean): LabelValue[] {
    return values.filter(
      (value) =>
        !value.custom ||
        (value.custom.selector === CONCEPT1 && active && !this.isProduction) // TODO: remove isProduction condition once Bearinx 2022.1 is released
    );
  }
}
