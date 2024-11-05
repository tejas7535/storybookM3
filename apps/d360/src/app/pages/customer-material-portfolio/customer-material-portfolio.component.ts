import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { GlobalSelectionHelperService } from '../../feature/global-selection/global-selection.service';
import {
  CustomerEntry,
  GlobalSelectionStatus,
} from '../../feature/global-selection/model';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { CustomerDropDownComponent } from '../../shared/components/customer-dropdown/customer-dropdown.component';
import { DataHintComponent } from '../../shared/components/data-hint/data-hint.component';
import { GlobalSelectionCriteriaComponent } from '../../shared/components/global-selection-criteria/global-selection-criteria/global-selection-criteria.component';
import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  HeaderActionBarComponent,
  ProjectedContendDirective,
} from '../../shared/components/header-action-bar/header-action-bar.component';
import { SingleAutocompleteSelectedEvent } from '../../shared/components/inputs/autocomplete/model';
import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompletePreLoadedComponent } from '../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { DisplayFunctions } from '../../shared/components/inputs/display-functions.utils';
import { StyledSectionComponent } from '../../shared/components/styled-section/styled-section.component';
import { OptionsLoadingResult } from '../../shared/services/selectable-options.service';
import { CustomerMaterialSingleAddModalComponent } from './components/modals/customer-material-single-add-modal/customer-material-single-add-modal.component';
import { CustomerMaterialPortfolioTableComponent } from './components/table/customer-material-portfolio-table/customer-material-portfolio-table.component';

@Component({
  selector: 'app-customer-material-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    GlobalSelectionCriteriaComponent,
    StyledSectionComponent,
    HeaderActionBarComponent,
    ProjectedContendDirective,
    ActionButtonComponent,
    CustomerDropDownComponent,
    SingleAutocompletePreLoadedComponent,
    LoadingSpinnerModule,
    DataHintComponent,
    CustomerMaterialPortfolioTableComponent,
  ],
  templateUrl: './customer-material-portfolio.component.html',
  styleUrl: './customer-material-portfolio.component.scss',
})
export class CustomerMaterialPortfolioComponent {
  protected globalSelection: GlobalSelectionState;
  protected loading = signal(false);
  protected customerData = signal<CustomerEntry[]>([]);
  protected selectedCustomer = signal<CustomerEntry>(null);
  protected globalSelectionStatus: GlobalSelectionStatus;
  protected customerSelectableValues: OptionsLoadingResult;

  /**
   * The DestroyRef instance.
   *
   * @protected
   * @type {DestroyRef}
   * @memberof CustomerMaterialPortfolioComponent
   */
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly globalSelectionService: GlobalSelectionHelperService,
    protected dialog: MatDialog
  ) {
    this.globalSelection = this.globalSelectionService.getGlobalSelection();
    this.loading.set(true);
    this.updateCustomerData();

    effect(() => {
      this.customerSelectableValues = {
        options: this.customerData()?.map((customer) => ({
          id: customer.customerNumber,
          text: customer.customerName,
        })),
      };
    });
  }

  onUpdateGlobalSelection($event: GlobalSelectionState) {
    this.globalSelection = $event;
    this.loading.set(true);
    this.updateCustomerData();
  }

  private updateCustomerData() {
    this.globalSelectionService
      .getCustomersData(this.globalSelection)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.customerData.set(data);
        if (this.customerData()) {
          this.selectedCustomer.set(this.customerData()[0]);
          this.customerControl.setValue({
            id: this.selectedCustomer().customerNumber,
            text: this.selectedCustomer().customerName,
          });
        }
        this.globalSelectionStatus =
          this.globalSelectionService.getGlobalSelectionStatus(
            { data: this.customerData() },
            this.selectedCustomer()
          );
        this.loading.set(false);
      });
  }

  protected readonly GlobalSelectionStatus = GlobalSelectionStatus;
  protected customerControl: FormControl<SelectableValue | string> =
    new FormControl<SelectableValue | string>(
      this.selectedCustomer()
        ? {
            id: this.selectedCustomer().customerNumber,
            text: this.selectedCustomer().customerName,
          }
        : ''
    );

  protected formGroup = new FormGroup({
    customerControl: this.customerControl,
  });

  handleSinglePhaseIn() {
    const dialogRef = this.dialog.open(
      CustomerMaterialSingleAddModalComponent,
      {
        data: this.selectedCustomer()
          ? this.selectedCustomer().customerNumber
          : null,
        disableClose: true,
      }
    );

    // TODO implement or remove if not needed
    dialogRef.afterClosed().subscribe((_result) => {});
  }

  handleMultiPhaseIn() {
    // TODO implement
  }

  protected readonly displayFnUnited = DisplayFunctions.displayFnUnited;

  handleCustomerChange($event: SingleAutocompleteSelectedEvent) {
    const customerEntry = this.customerData().find(
      (customer) => customer.customerNumber === $event.option.id
    );

    this.selectedCustomer.set(customerEntry);
  }
}
