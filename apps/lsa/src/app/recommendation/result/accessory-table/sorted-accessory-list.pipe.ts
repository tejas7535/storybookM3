import { Pipe, PipeTransform } from '@angular/core';

import { AccessoryTableGroup } from './accessory-table.model';

@Pipe({
  name: 'SortedAccessoryList',
})
export class SortedAccessoryListPipe implements PipeTransform {
  transform(value: { [key: string]: AccessoryTableGroup }) {
    const keymap = Object.entries(value)
      .sort((a, b) => b[1].groupClassPriority - a[1].groupClassPriority)
      .map((item) => ({ key: item[0], value: item[1] }));

    return keymap;
  }
}
