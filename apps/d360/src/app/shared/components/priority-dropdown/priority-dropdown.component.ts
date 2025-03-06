import { Component, output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { translate, TranslocoDirective } from '@jsverse/transloco';

import { Priority } from '../../../feature/alerts/model';
import { SelectableValue } from '../inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../inputs/display-functions.utils';
import { FilterDropdownComponent } from '../inputs/filter-dropdown/filter-dropdown.component';

@Component({
  selector: 'd360-priority-dropdown',
  imports: [TranslocoDirective, FilterDropdownComponent],
  templateUrl: './priority-dropdown.component.html',
})
export class PriorityDropdownComponent {
  protected readonly DisplayFunctions = DisplayFunctions;
  protected priorities: SelectableValue[] = [
    {
      id: Priority.Priority1.toString(),
      text: translate('overview.yourTasks.priority1'),
    },
    {
      id: Priority.Priority2.toString(),
      text: translate('overview.yourTasks.priority2'),
    },
    {
      id: Priority.Priority3.toString(),
      text: translate('overview.yourTasks.priority3'),
    },
  ];
  protected priorityControl = new FormControl(this.priorities);
  protected yourTasksForm: FormGroup = new FormGroup({
    priority: this.priorityControl,
  });

  public selectionChange = output<Priority[]>();

  protected onPrioritySelectionChange(value: SelectableValue[]) {
    this.selectionChange.emit(
      value?.map((priority): Priority => Number.parseInt(priority.id, 10))
    );
  }
}
