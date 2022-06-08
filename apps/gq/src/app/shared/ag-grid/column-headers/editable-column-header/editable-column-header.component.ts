import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

import { filter, map, pairwise, Subscription } from 'rxjs';

import { IHeaderParams } from '@ag-grid-community/all-modules';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { getSimulatedQuotation } from '../../../../core/store';
import { EVENT_NAMES, MassSimulationParams } from '../../../models';
import { PriceSource, QuotationDetail } from '../../../models/quotation-detail';
import { HelperService } from '../../../services/helper-service/helper-service.service';
import { ColumnFields } from '../../constants/column-fields.enum';
import { PriceSourceOptions } from './models/price-source-options.enum';

@Component({
  selector: 'gq-editable-column-header',
  templateUrl: './editable-column-header.component.html',
  styleUrls: ['./editable-column-header.component.scss'],
})
export class EditableColumnHeaderComponent
  implements IHeaderAngularComp, OnInit, OnDestroy
{
  private readonly subscription: Subscription = new Subscription();

  public params!: IHeaderParams;

  public sort: 'asc' | 'desc';

  editMode = false;
  value = 0;

  showEditIcon = false;

  editFormControl: UntypedFormControl;

  // price source header dependent values
  isPriceSource = false;
  priceSourceOptions = PriceSourceOptions;
  selectedPriceSource: PriceSourceOptions;

  @ViewChild('menuButton', { read: ElementRef }) public menuButton!: ElementRef;
  @ViewChild('inputField', { static: false }) public inputField!: ElementRef;

  constructor(
    private readonly store: Store,
    private readonly insightsService: ApplicationInsightsService
  ) {}

  ngOnInit(): void {
    this.addSubscriptions();
  }

  addSubscriptions(): void {
    const simulationReset$ = this.store.select(getSimulatedQuotation).pipe(
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
          filter((newVal: number | undefined | null) => newVal !== undefined)
        )
        .subscribe((newVal: number | null) => {
          this.updateMaterialSimulation(newVal || 0);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  agInit(params: IHeaderParams): void {
    this.value = 0;

    this.editFormControl = new UntypedFormControl('', [
      Validators.max(100),
      Validators.min(-100),
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
    this.showEditIcon =
      this.params.api.getSelectedRows()?.length > 0 &&
      this.isDataAvailable(this.params.column.getId()) &&
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
                ].includes(detail.priceSource))
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

  onKeyPress(event: KeyboardEvent): void {
    HelperService.validateNumberInputKeyPress(
      event,
      this.inputField?.nativeElement
    );
  }

  onPaste(event: ClipboardEvent): void {
    HelperService.validateNumberInputPaste(event, this.editFormControl, true);
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
    if (!this.editFormControl.valid) {
      return;
    }

    this.value = value;
    this.params.context.onMultipleMaterialSimulation(
      this.params.column.getId(),
      value
    );

    this.insightsService.logEvent(EVENT_NAMES.MASS_SIMULATION_UPDATED, {
      type: this.params.column.getId(),
      simulatedValue: value,
      numberOfSimulatedRows: this.params.api.getSelectedRows()?.length,
    } as MassSimulationParams);
  }

  public switchPriceSource(): void {
    this.selectedPriceSource =
      this.selectedPriceSource === PriceSourceOptions.GQ
        ? PriceSourceOptions.SAP
        : PriceSourceOptions.GQ;

    this.params.context.onPriceSourceSimulation(this.selectedPriceSource);
  }
}
