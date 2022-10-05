import { Pipe, PipeTransform } from '@angular/core';

import { LabelValue } from '@schaeffler/label-value';

import { CONCEPT1 } from '../models';

@Pipe({ name: 'automaticLubrication', standalone: true })
export class AutomaticLubricationPipe implements PipeTransform {
  public transform(values: LabelValue[], active: boolean): LabelValue[] {
    return values.filter(
      (value) => !value.custom || (value.custom.selector === CONCEPT1 && active)
    );
  }
}
