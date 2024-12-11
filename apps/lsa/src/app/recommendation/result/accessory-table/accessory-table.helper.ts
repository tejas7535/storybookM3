import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Accessory } from '@lsa/shared/models';

import {
  AccessoryTable,
  AccessoryTableFormGroup,
  AccessoryTableGroup,
} from './accessory-table.model';

export function transformAccessories(
  accessories: Accessory[],
  priorityLookup: Map<string, number>
): {
  [key: string]: AccessoryTableGroup;
} {
  const groups = new Map<string, Accessory[]>();
  for (const acc of accessories) {
    const className = `${acc.class}`;
    if (!groups.has(className)) {
      groups.set(className, []);
    }
    const expansion = [acc, ...groups.get(className)];
    groups.set(className, expansion);
  }

  const tableGroups = {} as { [key: string]: AccessoryTableGroup };
  for (const [key, items] of groups.entries()) {
    const classId = items[0].class_id;
    const keyFromMap = priorityLookup.get(classId);
    tableGroups[key] = {
      groupTitle: toCamelCase(key),
      groupClassId: classId,
      groupClassPriority: keyFromMap || 0,
      items: items.sort((a) => (a.is_recommendation ? -1 : 0)),
    };
  }

  return tableGroups;
}

export function generateFormGroup(
  tableData: AccessoryTable
): AccessoryTableFormGroup {
  const newFormGroup: { [key: string]: FormGroup } = {};
  for (const [groupKey, value] of Object.entries(tableData)) {
    const group: { [key: string]: FormControl } = {};
    for (const item of value.items) {
      group[item.fifteen_digit] = new FormControl(item.qty, [
        Validators.required,
        Validators.min(0),
      ]);
    }
    newFormGroup[groupKey] = new FormGroup(group);
  }

  return new FormGroup(newFormGroup);
}

export function toCamelCase(str: string): string {
  return str
    .split(/[\s-_]+/) // Split by spaces, hyphens, or underscores
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}
