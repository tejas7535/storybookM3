import { Component, inject, signal } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { OpenFunction, Priority } from '../../feature/alerts/model';
import { PriorityDropdownComponent } from '../../shared/components/priority-dropdown/priority-dropdown.component';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { TaskPriorityGridComponent } from './components/task-priority-grid/task-priority-grid.component';

@Component({
  selector: 'd360-overview',
  imports: [
    TranslocoDirective,
    TaskPriorityGridComponent,
    PriorityDropdownComponent,
    PushPipe,
    LoadingSpinnerModule,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  protected selectableOptionsService = inject(SelectableOptionsService);
  protected readonly OpenFunction = OpenFunction;

  protected selectedPriorities = signal<Priority[]>(null);
}
