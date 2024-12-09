import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationFilter } from '../../feature/demand-validation/demand-validation-filters';
import {
  KpiDateRanges,
  MaterialListEntry,
} from '../../feature/demand-validation/model';
import { PlanningView } from '../../feature/demand-validation/planning-view';
import { GlobalSelectionHelperService } from '../../feature/global-selection/global-selection.service';
import {
  CustomerEntry,
  GlobalSelectionStatus,
} from '../../feature/global-selection/model';
import { DataHintComponent } from '../../shared/components/data-hint/data-hint.component';
import { GlobalSelectionCriteriaComponent } from '../../shared/components/global-selection-criteria/global-selection-criteria/global-selection-criteria.component';
import {
  GlobalSelectionState,
  GlobalSelectionStateService,
} from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { StyledSectionComponent } from '../../shared/components/styled-section/styled-section.component';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { DemandValidationTableComponent } from './components/demand-validation-table/demand-validation-table.component';
import { MaterialListTableComponent } from './components/material-list-table/material-list-table.component';

@Component({
  selector: 'd360-demand-validation',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    GlobalSelectionCriteriaComponent,
    StyledSectionComponent,
    LoadingSpinnerModule,
    DataHintComponent,
    ActionBarComponent,
    MaterialListTableComponent,
    DemandValidationTableComponent,
  ],
  templateUrl: './demand-validation.component.html',
  styleUrl: './demand-validation.component.scss',
})
export class DemandValidationComponent {
  protected planningView: PlanningView = PlanningView.REQUESTED;
  protected pageTitle = `${translate('validation_of_demand.title', {})} | ${translate(`planing_type.title.${this.planningView}`, {})}`;
  protected globalSelection: GlobalSelectionState;
  // TODO: consider both properties below as signal
  protected customerData: CustomerEntry[];

  selectedCustomer = signal<CustomerEntry>(null);
  globalSelectionStatus: WritableSignal<GlobalSelectionStatus> = signal(null);
  loading: WritableSignal<boolean> = signal(false);
  selectedMaterialListEntry = signal<MaterialListEntry>(null);
  unsavedChanges = signal(false);

  protected materialListVisible = signal(true);

  protected demandValidationFilters = signal<DemandValidationFilter>(null);

  protected readonly destroyRef = inject(DestroyRef);

  /**
   * The GlobalSelectionStateService instance
   *
   * @private
   * @type {GlobalSelectionStateService}
   * @memberof DemandValidationComponent
   */
  private readonly globalSelectionStateService: GlobalSelectionStateService =
    inject(GlobalSelectionStateService);

  constructor(
    private readonly globalSelectionService: GlobalSelectionHelperService
  ) {
    this.globalSelection = this.globalSelectionStateService.getState();
    this.loading.set(true);
    this.updateCustomerData();
  }

  onUpdateGlobalSelection($event: GlobalSelectionState) {
    this.globalSelection = $event;
    this.loading.set(true);
    this.updateCustomerData();
  }

  private updateCustomerData() {
    this.globalSelectionStatus.set(null);

    this.globalSelectionService
      .getCustomersData(this.globalSelection)
      .pipe(
        take(1),
        tap((data) => {
          this.customerData = data;
          this.selectedCustomer.set(
            this.customerData ? this.customerData[0] : undefined
          );
          this.globalSelectionStatus.set(
            this.globalSelectionStateService.getGlobalSelectionStatus(
              { data: this.customerData },
              this.selectedCustomer()
            )
          );
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected readonly GlobalSelectionStatus = GlobalSelectionStatus;
  protected kpiRangeExceptions: Date[] = []; // TODO move to demand-validation-table.component.ts
  protected dateRange: KpiDateRanges;

  confirmContinueAndLooseUnsavedChanges() {
    const message = translate('error.unsaved_changes');
    const beforeUnloadHandler = (event: BeforeUnloadEvent): string => {
      event.preventDefault();

      return message;
    };

    window.removeEventListener('beforeunload', beforeUnloadHandler);

    if (this.unsavedChanges()) {
      window.addEventListener('beforeunload', beforeUnloadHandler);

      return confirm(message);
    }

    return true;
  }

  handleMaterialListVisible($event: { open: boolean }) {
    this.materialListVisible.set($event.open);
  }

  handleMaterialListEntrySelected($event: MaterialListEntry) {
    this.selectedMaterialListEntry.set($event);
  }

  handleKpiDateRangeChange($event: KpiDateRanges) {
    this.dateRange = $event;
  }

  handleCustomerChange($event: CustomerEntry) {
    this.selectedCustomer.set($event);
  }
}
