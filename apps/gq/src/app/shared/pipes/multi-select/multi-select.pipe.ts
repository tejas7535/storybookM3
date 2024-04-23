import { Pipe, PipeTransform } from '@angular/core';

import { translate } from '@jsverse/transloco';

@Pipe({
  name: 'multiSelect',
})
export class MultiSelectPipe implements PipeTransform {
  transform(value: (number | string)[]): unknown {
    const values = [...value].filter((i) => i !== 0);

    let text = values.slice(0, 4).join(', ');
    if (values.length > 4) {
      text += ` (${values.length - 4} ${translate(
        'caseView.caseCreation.createCustomerCase.additionalMaterials.others'
      )})`;
    }

    return text;
  }
}
