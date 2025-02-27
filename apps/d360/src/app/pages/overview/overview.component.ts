import { Component, signal } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import { OpenFunction, Priority } from '../../feature/alerts/model';
import { PriorityDropdownComponent } from '../../shared/components/priority-dropdown/priority-dropdown.component';
import { TaskPriorityGridComponent } from './components/task-priority-grid/task-priority-grid.component';

@Component({
  selector: 'd360-overview',
  standalone: true,
  imports: [
    TranslocoDirective,
    TaskPriorityGridComponent,
    PriorityDropdownComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  protected readonly OpenFunction = OpenFunction;
  protected selectedPriorities = signal<Priority[]>(null);
}
