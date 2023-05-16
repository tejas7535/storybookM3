import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

import { filter, map, Observable, pairwise, Subscription, take } from 'rxjs';

import {
  activeCaseFeature,
  getIsQuotationStatusActive,
} from '@gq/core/store/active-case';
import { userHasManualPriceRole, userHasRole } from '@gq/core/store/selectors';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';
import { IHeaderAngularComp } from 'ag-grid-angular';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { getPercentageRegex } from '../../../constants';
import { EVENT_NAMES, MassSimulationParams } from '../../../models';
import { PriceSource, QuotationDetail } from '../../../models/quotation-detail';
import { HelperService } from '../../../services/helper/helper.service';
import { ColumnFields } from '../../constants/column-fields.enum';
import { ExtendedColumnHeaderComponentParams } from './models/extended-column-header-component-params.model';
import { PriceSourceOptions } from './models/price-source-options.enum';

@Component({
  selector: 'gq-extended-column-header',
  templateUrl: './extended-column-header.component.html',
  styleUrls: ['./extended-column-header.component.scss'],
})
export class ExtendedColumnHeaderComponent
  implements IHeaderAngularComp, OnInit, OnDestroy
{
  private readonly subscription: Subscription = new Subscription();

  public params!: ExtendedColumnHeaderComponentParams;

  public sort: 'asc' | 'desc';

  editMode = false;
  value = 0;

  showEditIcon = false;

  editFormControl: UntypedFormControl = new UntypedFormControl();
  // price source header dependent values
  isPriceSource = false;
  selectedPriceSource: PriceSourceOptions;

  @ViewChild('menuButton', { read: ElementRef }) public menuButton!: ElementRef;
  @ViewChild('inputField', { static: false }) public inputField!: ElementRef;

  quotationStatus$: Observable<boolean>;

  private userHasManualPriceRole$: Observable<boolean>;
  private availablePriceSourceOptions: PriceSourceOptions[] = [];

  constructor(
    private readonly store: Store,
    private readonly insightsService: ApplicationInsightsService,
    private readonly translocoLocaleService: TranslocoLocaleService,
    private readonly featureToggleConfigService: FeatureToggleConfigService
  ) {}

  ngOnInit(): void {
    // Non-editable columns are not part of the simulation so we shouldn't add the subscriptions
    if (this.params.editableColumn) {
      this.addSubscriptions();
      this.editFormControl.markAllAsTouched();
    }

    // quotation is not available in case-view
    this.quotationStatus$ = this.store.select(getIsQuotationStatusActive);
    this.userHasManualPriceRole$ = this.store.pipe(userHasManualPriceRole);
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
          this.updateMaterialSimulation(
            HelperService.parseLocalizedInputValue(
              newVal,
              this.translocoLocaleService.getLocale()
            ) || 0
          );
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
    this.isPriceSource = params.column.getId() === ColumnFields.PRICE_SOURCE;

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
      this.store
        .pipe(userHasRole(this.params.editingRole))
        .pipe(take(1))
        .subscribe((userHasNeededRole: boolean) =>
          this.shouldShowEditIcon(userHasNeededRole)
        );
    } else {
      this.shouldShowEditIcon(true);
    }
  }

  private shouldShowEditIcon(userHasNeededEditingRole: boolean): void {
    this.showEditIcon =
      userHasNeededEditingRole &&
      this.params.api.getSelectedRows()?.length > 0 &&
      (this.isPriceSource // We do not need to check if there is data available in the column priceSource
        ? true
        : this.isDataAvailable(this.params.column.getId())) &&
      this.isPriceSourceEditingEnabled();

    if (!this.showEditIcon) {
      this.editMode = false;
      this.value = 0;
    }
  }

  private isPriceSourceEditingEnabled() {
    return this.isPriceSource
      ? this.params.api
          .getSelectedRows()
          .some(
            (detail: QuotationDetail) =>
              (detail.recommendedPrice &&
                detail.priceSource !== PriceSource.GQ) ||
              (detail.strategicPrice &&
                detail.priceSource !== PriceSource.STRATEGIC) ||
              (detail.sapPrice &&
                ![
                  PriceSource.SAP_SPECIAL,
                  PriceSource.SAP_STANDARD,
                  PriceSource.CAP_PRICE,
                ].includes(detail.priceSource)) ||
              (detail.targetPrice &&
                detail.priceSource !== PriceSource.TARGET_PRICE)
          )
      : true;
  }

  private isDataAvailable(columName: string): boolean {
    return this.params.api
      .getSelectedRows()
      .some(
        (detail: QuotationDetail) => detail[columName as keyof QuotationDetail]
      );
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

    if (this.isPriceSource) {
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

  getSelectedPriceSourceTranslationKey(): string {
    switch (this.selectedPriceSource) {
      case PriceSourceOptions.GQ:
        return 'gqPriceSource';
      case PriceSourceOptions.SAP:
        return 'sapPriceSource';
      case PriceSourceOptions.TARGET_PRICE:
        return 'targetPriceSource';
      default:
        return undefined;
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

    if (this.featureToggleConfigService.isEnabled('targetPrice')) {
      this.userHasManualPriceRole$
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
}
