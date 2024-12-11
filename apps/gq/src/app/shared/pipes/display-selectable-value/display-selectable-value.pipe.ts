import { Pipe, PipeTransform } from '@angular/core';

import { SelectableValue } from '@gq/shared/models/selectable-value.model';
import { displaySelectableValue } from '@gq/shared/utils/misc.utils';

@Pipe({
  name: 'displaySelectableValue',
  standalone: true,
})
export class DisplaySelectableValuePipe implements PipeTransform {
  transform(value: SelectableValue): string {
    return displaySelectableValue(value);
  }
}
