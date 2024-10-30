import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { take } from 'rxjs';

import { translate } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

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
  selector: 'app-demand-validation',
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
  protected loading: boolean;
  protected customerData: CustomerEntry[];
  protected selectedCustomer: CustomerEntry;
  protected globalSelectionStatus: GlobalSelectionStatus;
  protected selectedMaterialListEntry: MaterialListEntry;

  protected materialListVisible = true;

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
    this.globalSelection = this.globalSelectionService.getGlobalSelection();
    this.loading = true;
    this.updateCustomerData();
  }

  onUpdateGlobalSelection($event: GlobalSelectionState) {
    this.globalSelection = $event;
    this.loading = true;
    this.updateCustomerData();
  }

  private updateCustomerData() {
    this.globalSelectionService
      .getCustomersData(this.globalSelection)
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((data) => {
        this.customerData = data;
        this.selectedCustomer = this.customerData
          ? this.customerData[0]
          : undefined;
        this.globalSelectionStatus =
          this.globalSelectionService.getGlobalSelectionStatus(
            { data: this.customerData },
            this.selectedCustomer
          );
        this.loading = false;
      });
  }

  checkGlobalSelection(): boolean {
    return this.globalSelection && !this.globalSelectionStateService.isEmpty();
  }

  protected readonly GlobalSelectionStatus = GlobalSelectionStatus;
  protected kpiRangeExceptions: Date[] = []; // TODO move to demand-validation-table.component.ts
  protected dateRange: KpiDateRanges;

  handleMaterialListVisible($event: { open: boolean }) {
    this.materialListVisible = $event.open;
  }

  handleMaterialListEntrySelected($event: MaterialListEntry) {
    this.selectedMaterialListEntry = $event;
  }

  handleKpiDateRangeChange($event: KpiDateRanges) {
    this.dateRange = $event;
  }
}
