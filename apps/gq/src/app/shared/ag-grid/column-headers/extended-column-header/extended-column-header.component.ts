import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

import {
  combineLatest,
  filter,
  map,
  Observable,
  pairwise,
  Subscription,
  take,
} from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getIsQuotationStatusActive } from '@gq/core/store/active-case/active-case.selectors';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { parseLocalizedInputValue } from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';
import { IHeaderAngularComp } from 'ag-grid-angular';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { getPercentageRegex } from '../../../constants';
import { EVENT_NAMES, MassSimulationParams } from '../../../models';
import { PriceSource, QuotationDetail } from '../../../models/quotation-detail';
import { ColumnFields } from '../../constants/column-fields.enum';
import { ExtendedColumnHeaderComponentParams } from './models/extended-column-header-component-params.model';
import { PriceSourceOptions } from './models/price-source-options.enum';

@Component({
  selector: 'gq-extended-column-header',
  templateUrl: './extended-column-header.component.html',
  styleUrls: ['./extended-column-header.component.scss'],
  standalone: false,
})
export class ExtendedColumnHeaderComponent
  implements IHeaderAngularComp, OnInit, OnDestroy
{
  @ViewChild('menuButton', { read: ElementRef }) menuButton!: ElementRef;
  @ViewChild('inputField', { static: false }) inputField!: ElementRef;

  params!: ExtendedColumnHeaderComponentParams;

  sort: 'asc' | 'desc';

  editMode = false;
  value = 0;

  showEditIcon = false;

  editFormControl: UntypedFormControl = new UntypedFormControl();
  // price source header dependent values
  isPriceSourceColumn = false;
  selectedPriceSource: PriceSourceOptions;

  quotationStatus$: Observable<boolean>;

  private availablePriceSourceOptions: PriceSourceOptions[] = [];
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store,
    private readonly insightsService: ApplicationInsightsService,
    private readonly translocoLocaleService: TranslocoLocaleService,
    private readonly rolesFacade: RolesFacade
  ) {}

  ngOnInit(): void {
    // Non-editable columns are not part of the simulation so we shouldn't add the subscriptions
    if (this.params.editableColumn) {
      this.addSubscriptions();
      this.editFormControl.markAllAsTouched();
    }

    // quotation is not available in case-view
    this.quotationStatus$ = this.store.select(getIsQuotationStatusActive);
  }

  addSubscriptions(): void {
    const simulationReset$ = this.store
      .select(activeCaseFeature.selectSimulatedItem)
      .pipe(
        pairwise(),
        // eslint-disable-next-line ngrx/avoid-mapping-selectors
        map(([preVal, currentVal]) => preVal && currentVal === undefined),
        filter((val) => val)
      );

    this.subscription.add(
      simulationReset$.subscribe(() => {
        this.editFormControl.setValue(undefined as any);
        this.value = undefined;
        this.editMode = false;
      })
    );
    this.subscription.add(
      this.editFormControl?.valueChanges
        .pipe(
          filter((newVal: string | undefined | null) => newVal !== undefined)
        )
        .subscribe((newVal: string | null) => {
          let parsedValue =
            parseLocalizedInputValue(
              newVal,
              this.translocoLocaleService.getLocale()
            ) || 0;

          // If the input value is a percentage, we need to convert it to the same format
          // as BE returns percentage values (e.g. BE returns 49,45% as 0.4945)
          // Value is converted on "parent level" cause is used in multiple places
          if (this.params.isPercentageInputValue) {
            parsedValue = parsedValue / 100;
          }

          this.updateMaterialSimulation(parsedValue);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  agInit(params: ExtendedColumnHeaderComponentParams): void {
    this.value = 0;

    this.editFormControl = new UntypedFormControl('', [
      Validators.pattern(
        getPercentageRegex(this.translocoLocaleService.getLocale())
      ),
    ]);

    this.params = params;
    this.isPriceSourceColumn =
      params.column.getId() === ColumnFields.PRICE_SOURCE;

    params.column.addEventListener(
      'sortChanged',
      this.onSortChanged.bind(this)
    );

    this.onSortChanged();

    params.api.addEventListener(
      'rowSelected',
      this.updateShowEditIcon.bind(this)
    );

    this.updateShowEditIcon();
  }

  updateShowEditIcon() {
    if (!this.params.editableColumn) {
      return;
    }

    if (this.params.editingRole) {
      this.rolesFacade
        .userHasRole$(this.params.editingRole)
        .pipe(take(1))
        .subscribe((userHasNeededRole: boolean) =>
          this.shouldShowEditIcon(userHasNeededRole)
        );
    } else if (this.params.regionalRestrictions) {
      combineLatest([
        this.rolesFacade.userHasRole$(
          this.params.regionalRestrictions.regionRole
        ),
        this.rolesFacade.userHasRoles$(
          this.params.regionalRestrictions.editingRoles
        ),
      ])
        .pipe(take(1))
        .subscribe(([hasRegionRole, hasEditingRoles]) =>
          this.shouldShowEditIcon(hasRegionRole ? hasEditingRoles : true)
        );
    } else {
      this.shouldShowEditIcon(true);
    }
  }

  onSortChanged() {
    if (this.params.column.isSortAscending()) {
      this.sort = 'asc';
    } else if (this.params.column.isSortDescending()) {
      this.sort = 'desc';
    } else {
      this.sort = undefined;
    }
  }

  onMenuClicked(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.params.showColumnMenu(this.menuButton.nativeElement);
  }

  onSortRequested(event: MouseEvent) {
    let newSort: 'asc' | 'desc';
    if (!this.sort) {
      newSort = 'asc';
    }

    if (this.sort === 'asc') {
      newSort = 'desc';
    }

    this.params.setSort(newSort, event.shiftKey);
  }

  refresh() {
    return false;
  }

  enableEditMode(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.editMode = true;
    // Since we can't use ChangeDetectorRef in this component, we need to use
    // setTimeout here as a work around to force the change detection cycle to run.
    setTimeout(() => {
      this.inputField?.nativeElement.focus();
    });

    if (this.isPriceSourceColumn) {
      this.switchPriceSource();
    }

    this.insightsService.logEvent(EVENT_NAMES.MASS_SIMULATION_STARTED, {
      type: this.params.column.getId(),
      numberOfSimulatedRows: this.params.api.getSelectedRows()?.length,
    } as MassSimulationParams);
  }

  disableEditMode() {
    if (!this.value) {
      this.editMode = false;
    }
  }

  submitValue(e: Event) {
    e.stopPropagation();
    this.updateMaterialSimulation(this.editFormControl.value);
  }

  getSelectedPriceSourceTranslationKey(): string {
    switch (this.selectedPriceSource) {
      case PriceSourceOptions.GQ: {
        return 'gqPriceSource';
      }
      case PriceSourceOptions.SAP: {
        return 'sapPriceSource';
      }
      case PriceSourceOptions.TARGET_PRICE: {
        return 'targetPriceSource';
      }
      default: {
        return undefined;
      }
    }
  }

  switchPriceSource(): void {
    this.setAvailablePriceSourceOptions();
    const selectedPriceSourceOptionIndex =
      this.availablePriceSourceOptions.indexOf(this.selectedPriceSource);

    const nextPriceSourceOptionIndex =
      selectedPriceSourceOptionIndex <
      this.availablePriceSourceOptions.length - 1
        ? selectedPriceSourceOptionIndex + 1
        : 0;

    this.selectedPriceSource =
      this.availablePriceSourceOptions[nextPriceSourceOptionIndex];

    this.params.context.onPriceSourceSimulation(this.selectedPriceSource);
  }

  private shouldShowEditIcon(userHasNeededEditingRole: boolean): void {
    this.showEditIcon =
      userHasNeededEditingRole &&
      this.params.api.getSelectedRows()?.length > 0 &&
      (this.isPriceSourceColumn // We do not need to check if there is data available in the column priceSource
        ? this.isPriceSourceChangePossible()
        : this.isDataAvailable(this.params.column.getId()));

    if (!this.showEditIcon) {
      this.editMode = false;
      this.value = 0;
    }
  }

  private isPriceSourceChangePossible() {
    return this.params.api
      .getSelectedRows()
      .some(
        (detail: QuotationDetail) =>
          (detail.recommendedPrice && detail.priceSource !== PriceSource.GQ) ||
          (detail.strategicPrice &&
            detail.priceSource !== PriceSource.STRATEGIC) ||
          (detail.sapPrice &&
            ![
              PriceSource.SAP_SPECIAL,
              PriceSource.SAP_STANDARD,
              PriceSource.SECTOR_DISCOUNT,
              PriceSource.END_CUSTOMER_DISCOUNT,
              PriceSource.ZKI1,
              PriceSource.CAP_PRICE,
            ].includes(detail.priceSource)) ||
          (detail.targetPrice &&
            detail.priceSource !== PriceSource.TARGET_PRICE)
      );
  }

  private isDataAvailable(columName: string): boolean {
    return this.params.api
      .getSelectedRows()
      .some(
        (detail: QuotationDetail) => detail[columName as keyof QuotationDetail]
      );
  }

  private updateMaterialSimulation(value: number) {
    this.value = value;
    this.params.context.onMultipleMaterialSimulation(
      this.params.column.getId(),
      value,
      this.editFormControl.invalid
    );

    if (this.editFormControl.valid) {
      this.insightsService.logEvent(EVENT_NAMES.MASS_SIMULATION_UPDATED, {
        type: this.params.column.getId(),
        simulatedValue: value,
        numberOfSimulatedRows: this.params.api.getSelectedRows()?.length,
      } as MassSimulationParams);
    }
  }

  private setAvailablePriceSourceOptions(): void {
    this.availablePriceSourceOptions = [];
    const selectedRows = this.params.api.getSelectedRows();

    if (
      selectedRows.some(
        (detail: QuotationDetail) =>
          detail.recommendedPrice || detail.strategicPrice
      )
    ) {
      this.availablePriceSourceOptions.push(PriceSourceOptions.GQ);
    }

    if (selectedRows.some((detail: QuotationDetail) => detail.sapPrice)) {
      this.availablePriceSourceOptions.push(PriceSourceOptions.SAP);
    }

    this.rolesFacade.userHasManualPriceRole$
      .pipe(take(1))
      .subscribe((manualPriceRoleAvailable: boolean) => {
        if (manualPriceRoleAvailable) {
          const isTargetPriceAvailable = selectedRows.some(
            (detail: QuotationDetail) => !!detail.targetPrice
          );

          if (isTargetPriceAvailable) {
            this.availablePriceSourceOptions.push(
              PriceSourceOptions.TARGET_PRICE
            );
          }
        }
      });
  }
}
