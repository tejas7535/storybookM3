import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
} from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { OpenFunction, Priority } from '../../feature/alerts/model';
import { PriorityDropdownComponent } from '../../shared/components/priority-dropdown/priority-dropdown.component';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import {
  OverviewFilterComponent,
  OverviewFilterValue,
} from './components/overview-filter/overview-filter.component';
import { TaskPriorityGridComponent } from './components/task-priority-grid/task-priority-grid.component';

@Component({
  selector: 'd360-overview',
  imports: [
    TranslocoDirective,
    TaskPriorityGridComponent,
    PriorityDropdownComponent,
    OverviewFilterComponent,
    PushPipe,
    LoadingSpinnerModule,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  protected readonly selectableOptionsService: SelectableOptionsService =
    inject(SelectableOptionsService);
  protected readonly OpenFunction = OpenFunction;

  protected selectedPriorities = signal<Priority[]>(null);
  protected overviewFilterValue = signal<OverviewFilterValue>(null);
  protected gkamFilterIds: Signal<string[]> = computed(() =>
    this.overviewFilterValue()?.gkams?.map(
      (selectableGkam) => selectableGkam.id
    )
  );

  protected customerFilterIds: Signal<string[]> = computed(() =>
    this.overviewFilterValue()?.customers?.map(
      (selectableCustomer) => selectableCustomer.id
    )
  );
}
