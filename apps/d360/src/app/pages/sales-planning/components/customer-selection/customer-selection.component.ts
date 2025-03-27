import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

import { Subscription, take, tap } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutePath } from '../../../../app.routes.enum';
import { CustomerEntry } from '../../../../feature/global-selection/model';
import {
  CustomerInfo,
  SalesPlan,
} from '../../../../feature/sales-planning/model';
import { SalesPlanningService } from '../../../../feature/sales-planning/sales-planning.service';
import { SingleAutocompleteSelectedEvent } from '../../../../shared/components/inputs/autocomplete/model';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { DisplayFunctions } from '../../../../shared/components/inputs/display-functions.utils';
import { NumberWithoutFractionDigitsPipe } from '../../../../shared/pipes/number-without-fraction-digits.pipe';
import { CustomerSelectionChange } from '../../sales-planning.component';
import { CustomerInfoModalComponent } from '../customer-info-modal/customer-info-modal.component';

@Component({
  selector: 'd360-customer-selection',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    SingleAutocompleteOnTypeComponent,
    MatDivider,
    MatIcon,
    MatIconButton,
    NumberWithoutFractionDigitsPipe,
  ],
  templateUrl: './customer-selection.component.html',
  styleUrl: './customer-selection.component.scss',
})
export class CustomerSelectionComponent implements OnInit {
  protected formGroup = new FormGroup({
    customer: new FormControl<SelectableValue | null | string>(null),
  });

  protected readonly onCustomerSelectionChange =
    output<CustomerSelectionChange>();

  protected selectedCustomer = signal<CustomerEntry>(null);
  protected selectedCustomerInfo = signal<CustomerInfo[]>([]);
  protected selectedCustomerSalesPlan = signal<SalesPlan[]>([]);
  protected selectedCustomerPlanningCurrency = signal<string>(null);

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  protected translocoLocaleService = inject(TranslocoLocaleService);
  protected translocoService = inject(TranslocoService);

  private readonly salesPlanningService = inject(SalesPlanningService);

  protected readonly DisplayFunctions = DisplayFunctions;

  public ngOnInit(): void {
    const customer: string | null =
      JSON.parse(
        sessionStorage.getItem(AppRoutePath.SalesValidationPage) || '{}'
      )?.customerNumber || null;

    if (customer) {
      this.formGroup.patchValue({
        // Hint: it's not a multi selection, so we use the first one
        customer: Array.isArray(customer) ? customer[0] : customer,
      });

      const subscription: Subscription = this.formGroup.valueChanges
        .pipe(
          take(1),
          tap((values) =>
            this.handleCustomerChange({
              option: values?.customer as SelectableValue,
            })
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => subscription.unsubscribe());
    }
  }

  public handleCustomerChange($event: SingleAutocompleteSelectedEvent): void {
    this.selectedCustomer.set(
      !$event?.option || $event?.option?.id === null
        ? null
        : {
            customerNumber: $event?.option?.id,
            customerName: $event?.option?.text,
          }
    );

    this.selectedCustomerSalesPlan.set([]);
    this.selectedCustomerPlanningCurrency.set(null);
    this.selectedCustomerInfo.set([]);

    this.fetchCustomerSalesPlan();
  }

  private fetchCustomerSalesPlan(): void {
    if (this.selectedCustomer()) {
      sessionStorage.setItem(
        AppRoutePath.SalesValidationPage,
        JSON.stringify({
          customerNumber: this.selectedCustomer()?.customerNumber,
        })
      );

      this.salesPlanningService
        .getCustomerSalesPlan(this.selectedCustomer()?.customerNumber)
        .pipe(
          tap((response) => {
            const currentYear = new Date().getFullYear();

            this.selectedCustomerSalesPlan.set(
              [
                {
                  unconstrained: null,
                  constrained: response.invoiceSalesTwoYearsAgo,
                  year: currentYear - 2,
                },
                {
                  unconstrained: null,
                  constrained: response.invoiceSalesPreviousYear,
                  year: currentYear - 1,
                },
                {
                  unconstrained: response.unconstrainedPlanThisYear,
                  constrained: response.constrainedPlanThisYear,
                  year: currentYear,
                },
                {
                  unconstrained: response.unconstrainedPlanNextYear,
                  constrained: response.constrainedPlanNextYear,
                  year: currentYear + 1,
                },
                {
                  unconstrained: response.unconstrainedPlanTwoYearsFromNow,
                  constrained: response.constrainedPlanTwoYearsFromNow,
                  year: currentYear + 2,
                },
                {
                  unconstrained: response.unconstrainedPlanThreeYearsFromNow,
                  constrained: response.constrainedPlanThreeYearsFromNow,
                  year: currentYear + 3,
                },
              ].sort((a, b) => a.year - b.year)
            );

            this.selectedCustomerPlanningCurrency.set(
              response.planningCurrency
            );

            this.onCustomerSelectionChange.emit({
              customerName: this.selectedCustomer()?.customerName,
              customerNumber: this.selectedCustomer()?.customerNumber,
              planningCurrency: response.planningCurrency,
            });
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    } else {
      sessionStorage.setItem(
        AppRoutePath.SalesValidationPage,
        JSON.stringify(null)
      );

      this.onCustomerSelectionChange.emit({
        customerName: null,
        customerNumber: null,
        planningCurrency: null,
      });
    }
  }

  protected handleCustomerInfoClick(): void {
    if (this.selectedCustomerInfo().length === 0) {
      this.salesPlanningService
        .getCustomerInfo(
          this.selectedCustomer().customerNumber,
          this.translocoService.getActiveLang()
        )
        .pipe(
          tap((response) => {
            this.selectedCustomerInfo.set(response);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.openCustomerInfoModal();
        });
    } else {
      this.openCustomerInfoModal();
    }
  }

  private openCustomerInfoModal(): void {
    this.dialog.open(CustomerInfoModalComponent, {
      data: {
        customerInfo: this.selectedCustomerInfo(),
        customerNumber: this.selectedCustomer().customerNumber,
        customerName: this.selectedCustomer().customerName,
      },
      autoFocus: false,
      disableClose: true,
      panelClass: ['form-dialog'],
      minWidth: '50vw',
    });
  }
}
