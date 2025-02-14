import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { translate, TranslocoDirective } from '@jsverse/transloco';

import { OpenFunction, Priority } from '../../feature/alerts/model';
import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../shared/components/inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { TaskPriorityGridComponent } from './components/task-priority-grid/task-priority-grid.component';

@Component({
  selector: 'd360-overview',
  standalone: true,
  imports: [
    TranslocoDirective,
    FilterDropdownComponent,
    TaskPriorityGridComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
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
  protected readonly DisplayFunctions = DisplayFunctions;
  protected priorityControl = new FormControl(this.priorities);
  protected priorityFilter: Priority[] = null;
  protected yourTasksForm: FormGroup = new FormGroup({
    priority: this.priorityControl,
  });

  protected onPrioritySelectionChange(value: SelectableValue[] | null) {
    this.priorityFilter = value?.map((priority: SelectableValue) =>
      Number.parseInt(priority.id, 10)
    );
  }

  protected readonly OpenFunction = OpenFunction;
}
