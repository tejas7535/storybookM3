import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-enterprise';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AlertService } from '../../feature/alerts/alert.service';
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
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly alertService: AlertService = inject(AlertService);
  protected loading$ = this.selectableOptionsService.loading$;
  protected alertStatus: SelectableValue[] = [
    { id: AlertStatus.ACTIVE, text: translate('alert.select.active') },
    { id: AlertStatus.COMPLETED, text: translate('alert.select.completed') },
    {
      id: AlertStatus.DEACTIVATED,
      text: translate('alert.select.deactivated'),
    },
  ];
  private gridApi: GridApi | null = null;
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

  constructor() {
    this.alertService
      .getRefreshEvent()
      .pipe(
        tap(() => {
          this.updateGrid(this.statusControl.getRawValue().id as AlertStatus);
          this.refreshCounter();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected updateStatus(event: Partial<SelectableValue>) {
    if (event) {
      this.selectedStatus.set(event.id as AlertStatus);
    }
  }
  protected getApi(api: GridApi): void {
    this.gridApi = api;
  }

  protected refreshCounter() {
    this.alertService.refreshHashTimer();
    this.alertService.updateNotificationCount();
  }

  private updateGrid(status: AlertStatus) {
    if (this.gridApi) {
      this.gridApi.setGridOption(
        'serverSideDatasource',
        this.alertService.createAlertDatasource(
          status,
          this.selectedPriorities()
        )
      );
    }
  }
}
