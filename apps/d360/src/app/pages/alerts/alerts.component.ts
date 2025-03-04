import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AlertStatus, Priority } from '../../feature/alerts/model';
import {
  HeaderActionBarComponent,
  ProjectedContendDirective,
} from '../../shared/components/header-action-bar/header-action-bar.component';
import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../shared/components/inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { PriorityDropdownComponent } from '../../shared/components/priority-dropdown/priority-dropdown.component';
import { StyledSectionComponent } from '../../shared/components/styled-section/styled-section.component';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { AlertTableComponent } from './table/alert-table/alert-table.component';
@Component({
  selector: 'd360-alerts',
  standalone: true,
  imports: [
    AgGridModule,
    AlertTableComponent,
    FilterDropdownComponent,
    HeaderActionBarComponent,
    ProjectedContendDirective,
    SharedTranslocoModule,
    StyledSectionComponent,
    LoadingSpinnerModule,
    PushPipe,
    PriorityDropdownComponent,
  ],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
})
export class AlertsComponent {
  protected readonly selectableOptionsService: SelectableOptionsService =
    inject(SelectableOptionsService);
  protected loading$ = this.selectableOptionsService.loading$;
  protected alertStatus: SelectableValue[] = [
    { id: AlertStatus.ACTIVE, text: translate('alert.select.active') },
    { id: AlertStatus.COMPLETED, text: translate('alert.select.completed') },
    {
      id: AlertStatus.DEACTIVATED,
      text: translate('alert.select.deactivated'),
    },
  ];
  protected readonly DisplayFunctions = DisplayFunctions;

  protected statusControl = new FormControl<SelectableValue>(
    this.alertStatus[0],
    Validators.required
  );
  protected formGroup = new FormGroup({
    status: this.statusControl,
  });
  protected selectedPriorities = signal<Priority[]>([
    Priority.Priority1,
    Priority.Priority2,
    Priority.Priority3,
  ]);
  protected selectedStatus = signal<AlertStatus>(AlertStatus.ACTIVE);

  protected updateStatus(status: SelectableValue) {
    if (status) {
      this.selectedStatus.set(status.id as AlertStatus);
    }
  }
}
