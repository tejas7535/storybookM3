/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { catchError, EMPTY, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { parseISO } from 'date-fns';

import { getBackendRoles } from '@schaeffler/azure-auth';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  CMPData,
  parsePortfolioStatusOrNull,
  PortfolioStatus,
} from '../../feature/customer-material-portfolio/cmp-modal-types';
import { CMPEntry } from '../../feature/customer-material-portfolio/model';
import { GlobalSelectionHelperService } from '../../feature/global-selection/global-selection.service';
import {
  CustomerEntry,
  GlobalSelectionStatus,
} from '../../feature/global-selection/model';
import { CustomerDropDownComponent } from '../../shared/components/customer-dropdown/customer-dropdown.component';
import { DataHintComponent } from '../../shared/components/data-hint/data-hint.component';
import { GlobalSelectionCriteriaComponent } from '../../shared/components/global-selection-criteria/global-selection-criteria/global-selection-criteria.component';
import {
  GlobalSelectionState,
  GlobalSelectionStateService,
} from '../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  HeaderActionBarComponent,
  ProjectedContendDirective,
} from '../../shared/components/header-action-bar/header-action-bar.component';
import { SingleAutocompleteSelectedEvent } from '../../shared/components/inputs/autocomplete/model';
import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../shared/components/inputs/display-functions.utils';
import { StyledSectionComponent } from '../../shared/components/styled-section/styled-section.component';
import {
  OptionsLoadingResult,
  SelectableOptionsService,
} from '../../shared/services/selectable-options.service';
import {
  checkRoles,
  customerMaterialPortfolioChangeAllowedRoles,
} from '../../shared/utils/auth/roles';
import { CustomerMaterialMultiModalComponent } from './components/modals/customer-material-multi-modal/customer-material-multi-modal.component';
import {
  CustomerMaterialSingleModalComponent,
  SpecificModalContentType,
} from './components/modals/customer-material-single-modal/customer-material-single-modal.component';
import { CustomerMaterialPortfolioTableComponent } from './components/table/customer-material-portfolio-table/customer-material-portfolio-table.component';
import {
  CMPChangeModalFlavor,
  CMPModal,
  CMPSpecificModal,
} from './components/table/status-actions';

/**
 * CustomerMaterialPortfolioComponent displays the customer material portfolio.
 * It handles the global selection state, customer data, loading states, and modal interactions.
 *
 * @export
 * @class CustomerMaterialPortfolioComponent
 */
@Component({
  selector: 'd360-customer-material-portfolio',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    GlobalSelectionCriteriaComponent,
    StyledSectionComponent,
    HeaderActionBarComponent,
    CustomerDropDownComponent,
    LoadingSpinnerModule,
    DataHintComponent,
    CustomerMaterialPortfolioTableComponent,
    MatButtonModule,
    MatIcon,
    ProjectedContendDirective,
  ],
  templateUrl: './customer-material-portfolio.component.html',
  styleUrl: './customer-material-portfolio.component.scss',
})
export class CustomerMaterialPortfolioComponent {
  // Injecting necessary services and components using Angular's Dependency Injection
  private readonly globalSelectionStateService: GlobalSelectionStateService =
    inject(GlobalSelectionStateService);
  private readonly globalSelectionService: GlobalSelectionHelperService =
    inject(GlobalSelectionHelperService);
  protected dialog: MatDialog = inject(MatDialog);
  protected readonly selectableOptionsService: SelectableOptionsService =
    inject(SelectableOptionsService);
  private readonly store = inject(Store);

  // Signals for managing component state, which are automatically updated in the view
  protected globalSelectionState: WritableSignal<GlobalSelectionState> = signal(
    this.globalSelectionStateService.getState()
  );
  protected loading: WritableSignal<boolean> = signal(false);
  protected customerData: WritableSignal<CustomerEntry[]> = signal<
    CustomerEntry[]
  >([]);
  protected selectedCustomer: WritableSignal<CustomerEntry | null> =
    signal<CustomerEntry | null>(null);
  protected globalSelectionStatus: WritableSignal<GlobalSelectionStatus | null> =
    signal(null);
  protected refreshCounter: WritableSignal<number> = signal(0);
  protected customerSelectableValues: WritableSignal<OptionsLoadingResult> =
    signal({ options: [] });

  protected readonly GlobalSelectionStatus: typeof GlobalSelectionStatus =
    GlobalSelectionStatus;

  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected types: typeof SpecificModalContentType = SpecificModalContentType;

  protected formGroup: FormGroup = new FormGroup({
    customerControl: new FormControl<SelectableValue | string>(
      this.selectedCustomer()
        ? {
            id: this.selectedCustomer().customerNumber,
            text: this.selectedCustomer().customerName,
          }
        : '',
      Validators.required
    ),
  });

  protected readonly displayFnUnited = DisplayFunctions.displayFnUnited;

  private readonly backendRoles = toSignal(this.store.select(getBackendRoles));

  protected authorizedToChange = computed(() =>
    this.backendRoles()
      ? checkRoles(
          this.backendRoles(),
          customerMaterialPortfolioChangeAllowedRoles
        )
      : false
  );

  /**
   *  Creates an instance of CustomerMaterialPortfolioComponent.
   *
   * @memberof CustomerMaterialPortfolioComponent
   */
  public constructor() {
    effect(() =>
      this.customerSelectableValues.set({
        options: this.customerData()?.map((customer) => ({
          id: customer.customerNumber,
          text: customer.customerName,
        })),
      })
    );
  }

  /**
   * Updates the component state when the global selection state changes.
   *
   * @protected
   * @param {GlobalSelectionState} globalSelectionState - The new global selection state
   * @memberof CustomerMaterialPortfolioComponent
   */
  protected onUpdateGlobalSelectionState(
    globalSelectionState: GlobalSelectionState
  ) {
    this.globalSelectionState.set(globalSelectionState);
    this.updateCustomerData();
  }

  /**
   * Opens a dialog modal for specific customer material portfolio interactions.
   *
   * @protected
   * @param {CMPModal} modal - The type of modal to open
   * @param {(CMPEntry | null)} entry - The customer material portfolio entry associated with the modal
   * @param {PortfolioStatus} changeToStatus - The new status to set for the entry (if applicable)
   * @memberof CustomerMaterialPortfolioComponent
   */
  protected openSingleDialog(
    modal: CMPModal,
    entry: CMPEntry | null,
    changeToStatus: PortfolioStatus
  ): void {
    const dialogData = this.getDialogData(modal, entry, changeToStatus);

    this.dialog
      .open(CustomerMaterialSingleModalComponent, {
        data: {
          type: this.getTypeByStatus(dialogData.data, modal),
          modal,
          successorSchaefflerMaterial:
            entry?.successorSchaefflerMaterial ?? undefined,
          ...dialogData,
        },
        disableClose: true,
        width: '900px',
        maxWidth: '900px',
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        take(1),
        tap(
          (refresh) =>
            refresh && this.refreshCounter.update((count) => count + 1)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected handleMultiPhaseIn() {
    this.dialog
      .open(CustomerMaterialMultiModalComponent, {
        disableClose: true,
        data: {
          customerNumber: this.selectedCustomer()
            ? this.selectedCustomer().customerNumber
            : null,
        },
        panelClass: ['table-dialog', 'customer-material-portfolio'],
        autoFocus: false,
        maxHeight: 'calc(100% - 64px)',
        maxWidth: 'none',
        width: '900px',
      })
      .afterClosed()
      .pipe(
        take(1),
        tap(
          (refresh) =>
            refresh && this.refreshCounter.update((count) => count + 1)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected handleCustomerChange($event: SingleAutocompleteSelectedEvent) {
    this.selectedCustomer.set(
      this.customerData().find(
        (customer) => customer.customerNumber === $event.option.id
      ) ?? null
    );
  }

  /**
   * Logic for updating customer data based on the global selection state
   *
   * @private
   * @memberof CustomerMaterialPortfolioComponent
   */
  private updateCustomerData() {
    this.loading.set(true);

    this.globalSelectionService
      .getCustomersData(this.globalSelectionState())
      .pipe(
        take(1),
        tap((data) => {
          this.customerData.set(data);

          if (this.customerData()) {
            const customer: CustomerEntry = this.customerData()[0];
            this.selectedCustomer.set(customer);
            this.formGroup.setValue({
              customerControl: {
                id: customer.customerNumber,
                text: customer.customerName,
              },
            });
          }

          this.globalSelectionStatus.set(
            this.globalSelectionStateService.getGlobalSelectionStatus(
              { data: this.customerData() },
              this.selectedCustomer()
            )
          );

          this.loading.set(false);
        }),
        catchError(() => {
          this.loading.set(false);

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Logic for determining the type of modal content based on the entry's status and selected modal
   *
   * @private
   * @param {CMPData} data
   * @param {CMPModal} modal
   * @return {SpecificModalContentType}
   * @memberof CustomerMaterialPortfolioComponent
   */
  private getTypeByStatus(
    data: CMPData,
    modal: CMPModal
  ): SpecificModalContentType {
    if (modal === CMPSpecificModal.SUBSTITUTION_PROPOSAL) {
      return SpecificModalContentType.SubstitutionProposal;
    } else if (modal === CMPSpecificModal.SCHAEFFLER_SUBSTITUTION) {
      return SpecificModalContentType.NoContent;
    }

    switch (data.portfolioStatus) {
      case 'PI': {
        return SpecificModalContentType.PhaseIn;
      }

      case 'PO': {
        return SpecificModalContentType.PhaseOut;
      }

      case 'SE': {
        return SpecificModalContentType.Substitution;
      }

      case 'IA': {
        return SpecificModalContentType.Status;
      }

      case 'SB':
      case 'SI':
      case 'SP':
      case 'AC': {
        return SpecificModalContentType.NoContent;
      }

      default: {
        return SpecificModalContentType.Error;
      }
    }
  }

  /**
   *  Logic for preparing the dialog data based on the selected modal and entry (if applicable)
   *
   * @private
   * @param {CMPModal} modal
   * @param {(CMPEntry | null)} entry
   * @param {PortfolioStatus} changeToStatus
   * @return {({
   *     data: CMPData;
   *     description: string | null;
   *     title: string;
   *     edit: boolean;
   *     subtitle?: string;
   *   })}
   * @memberof CustomerMaterialPortfolioComponent
   */
  private getDialogData(
    modal: CMPModal,
    entry: CMPEntry | null,
    changeToStatus: PortfolioStatus
  ): {
    data: CMPData;
    description: string | null;
    title: string;
    edit: boolean;
    subtitle?: string;
    modal?: CMPModal;
  } {
    switch (modal) {
      case CMPSpecificModal.SCHAEFFLER_SUBSTITUTION:
      case CMPSpecificModal.SUBSTITUTION_PROPOSAL:
      case CMPChangeModalFlavor.EDIT_MODAL:
      case CMPChangeModalFlavor.REVERT_SUBSTITUTION:
      case CMPChangeModalFlavor.STATUS_TO_ACTIVE:
      case CMPChangeModalFlavor.STATUS_TO_INACTIVE:
      case CMPChangeModalFlavor.STATUS_TO_PHASE_IN:
      case CMPChangeModalFlavor.STATUS_TO_PHASE_OUT:
      case CMPChangeModalFlavor.STATUS_TO_SUBSTITUTION: {
        const data: CMPData = {
          customerNumber: entry?.customerNumber,
          materialNumber: entry?.materialNumber,
          materialDescription: entry?.materialDescription,
          demandCharacteristic: entry?.demandCharacteristic,
          successorMaterial: entry?.successorMaterial,
          demandPlanAdoption: null,
          repDate: entry?.repDate ? parseISO(entry?.repDate) : null,
          portfolioStatus:
            changeToStatus ??
            parsePortfolioStatusOrNull(entry?.portfolioStatus),
          autoSwitchDate: entry?.pfStatusAutoSwitch
            ? parseISO(entry?.pfStatusAutoSwitch)
            : null,
        };

        return {
          data,
          description: null,
          title: translate(this.getTitle(modal)),
          subtitle: this.getSubtitle(data),
          edit: true,
        };
      }

      default: {
        // PhaseIn (new entry)
        return {
          data: {
            customerNumber: this.selectedCustomer()
              ? this.selectedCustomer().customerNumber
              : null,
            portfolioStatus: 'PI',
            materialNumber: null,
            materialDescription: null,
            demandCharacteristic: null,
            autoSwitchDate: null,
            repDate: null,
            successorMaterial: null,
            demandPlanAdoption: null,
          },
          description: null,
          title: translate(
            `customer_material_portfolio.phase_in_modal.headline`
          ),
          subtitle: 'customer_material_portfolio.modal.subheader.phase_in',
          edit: false,
          modal: CMPChangeModalFlavor.STATUS_TO_PHASE_IN,
        };
      }
    }
  }

  /**
   * Logic for determining the modal subtitle based on the entry's status
   *
   * @private
   * @param {CMPData} data
   * @return {(string | undefined)}
   * @memberof CustomerMaterialPortfolioComponent
   */
  private getSubtitle(data: CMPData): string | undefined {
    let subtitle;
    switch (data.portfolioStatus) {
      case 'PI': {
        subtitle = 'customer_material_portfolio.modal.subheader.phase_in';
        break;
      }

      case 'PO': {
        subtitle = 'customer_material_portfolio.modal.subheader.phase_out';
        break;
      }

      case 'SE': {
        subtitle = 'customer_material_portfolio.modal.subheader.substitution';
        break;
      }

      case 'IA': {
        subtitle = 'customer_material_portfolio.inactive_modal.headline';
        break;
      }

      default: {
        break;
      }
    }

    return subtitle;
  }

  /**
   * Logic for determining the modal title based on the selected modal
   *
   * @private
   * @param {CMPModal} modal
   * @return {string}
   * @memberof CustomerMaterialPortfolioComponent
   */
  private getTitle(modal: CMPModal): string {
    switch (modal) {
      case CMPSpecificModal.SCHAEFFLER_SUBSTITUTION:
      case CMPSpecificModal.SUBSTITUTION_PROPOSAL: {
        return 'customer_material_portfolio.substitution_modal.headline';
      }

      default: {
        return `customer_material_portfolio.modal_headline.${modal}`;
      }
    }
  }
}
