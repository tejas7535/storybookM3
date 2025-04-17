/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Subject, takeUntil, tap } from 'rxjs';

import { PDFGeneratorService } from '@lsa/core/services/pdf-generation/pdf-generator.service';
import { environment } from '@lsa/environments/environment';
import { Accessory, AccessoryClassEntry } from '@lsa/shared/models';
import { MediasCallbackResponse } from '@lsa/shared/models/price-availibility.model';
import { LsaCurrencyPipe } from '@lsa/shared/pipes/lsa-currency.pipe';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  generateFormGroup,
  transformAccessories,
} from './accessory-table.helper';
import {
  AccessoryTable,
  AccessoryTableFormGroup,
  TableGroupState,
} from './accessory-table.model';
import { SortedAccessoryListPipe } from './sorted-accessory-list.pipe';

@Component({
  selector: 'lsa-accessory-table',
  templateUrl: './accessory-table.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    SharedTranslocoModule,
    SortedAccessoryListPipe,
    LsaCurrencyPipe,
  ],
})
export class AccessoryTableComponent implements OnChanges, OnDestroy {
  @Input()
  public readonly accessories: Accessory[];

  @Input()
  public readonly classPriorities: AccessoryClassEntry[];

  @Input()
  public isBusinessUser: boolean;

  @Input()
  public priceAndAvailabilityResponses: MediasCallbackResponse['items'];

  public tableFormGroup!: AccessoryTableFormGroup;

  public accGroups: AccessoryTable;
  public tableGroupStates: { [key: string]: TableGroupState };
  public tableSummaryState: {
    totalQty: number;
    totalPrice?: number;
  } = {
    totalQty: 0,
  };

  private readonly destroy$ = new Subject<void>();
  private readonly formUpdate$ = new Subject<void>();
  private readonly priorityMap = new Map<string, number>();

  public showEmptyState = true;
  public imagePlaceholder = `${environment.assetsPath}/images/placeholder.png`;
  public currency: string;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly pdfService: PDFGeneratorService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.classPriorities?.currentValue) {
      this.transformPriorities();
    }

    if (changes.accessories?.currentValue) {
      this.formUpdate$.next();
      this.accGroups = {};
      this.tableGroupStates = {};
      this.tableSummaryState = { totalQty: 0 };
      this.generateAccessoriesForInput();
      this.showEmptyState = false;
    } else if (changes.priceAndAvailabilityResponses) {
      this.tableSummaryState = { totalQty: 0 };
      this.updateAccessoryithPriceAndAvailability();

      if (this.tableGroupStates) {
        this.calculateTableState();
      }

      this.changeDetectorRef.detectChanges();
    } else {
      this.showEmptyState = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Transforms the priorities on the class list field
   * into an easier to look up map structure
   **/
  transformPriorities() {
    this.classPriorities
      .filter((classObj) => !this.isNaN(classObj.priority))
      .forEach((classObj) =>
        this.priorityMap.set(classObj.class, classObj.priority)
      );
  }

  generateAccessoriesForInput(): void {
    this.accGroups = transformAccessories(this.accessories, this.priorityMap);
    this.tableFormGroup = generateFormGroup(this.accGroups);
    this.pdfService.setFormData(this.tableFormGroup.getRawValue());
    this.tableFormGroup.valueChanges
      .pipe(
        takeUntil(this.formUpdate$),
        tap((newValue) => this.pdfService.setFormData(newValue))
      )
      .subscribe((newValue) => {
        this.tableSummaryState.totalQty = 0;
        this.tableSummaryState.totalPrice = 0;

        for (const [key, value] of Object.entries(newValue)) {
          const qty = this.getGroupItemsQuantity(value);
          const totalNetPrice = this.getGroupTotal(value, key);

          this.tableSummaryState.totalPrice += totalNetPrice;
          this.tableSummaryState.totalQty += qty;
          this.tableGroupStates[key].totalQty = qty;
          this.tableGroupStates[key].totalNetPrice = totalNetPrice;
        }
      });

    const states: { [key: string]: TableGroupState } = {};

    Object.entries(this.accGroups).forEach(([group, value]) => {
      const totalQty = value.items.reduce(
        (prev, current) => prev + current.qty,
        0
      );

      let totalNetPrice = 0;

      value.items.forEach((acc) => {
        if (!acc.price || acc.qty === 0) {
          return;
        }

        if (!this.tableSummaryState.totalPrice) {
          this.tableSummaryState.totalPrice = 0;
        }

        this.setCurrency(acc.currency);
        const price = acc.price * acc.qty;
        totalNetPrice += price;
      });

      states[group] = {
        isOpen: false,
        totalQty,
        totalNetPrice,
      };

      this.tableSummaryState.totalQty += totalQty;
      this.tableSummaryState.totalPrice += totalNetPrice;
    });

    this.tableGroupStates = states;
  }

  onToggleGroupClick(groupName: string) {
    if (this.tableGroupStates[groupName]) {
      this.tableGroupStates[groupName].isOpen =
        !this.tableGroupStates[groupName].isOpen;
    }
  }

  changeQty(groupName: string, controlName: string, direction: '-' | '+') {
    const originalValue = this.tableFormGroup
      .get(groupName)
      .get(controlName).value;
    this.tableFormGroup
      .get(groupName)
      .get(controlName)
      .setValue(direction === '+' ? originalValue + 1 : originalValue - 1);
  }

  minusButtonEnabled(groupName: string, formControlName: string): boolean {
    return this.tableFormGroup.get(groupName).get(formControlName).value >= 1;
  }

  isNaN(test: number | any): boolean {
    return Number.isNaN(test);
  }

  shouldShowPriceColumn(): boolean {
    return Object.values(this.tableGroupStates).some(
      (state) => !!state.totalNetPrice
    );
  }

  private calculateTableState(): void {
    this.tableSummaryState.totalQty = 0;
    this.tableSummaryState.totalPrice = 0;

    Object.entries(this.tableFormGroup.value).forEach(([group, value]) => {
      const groupTotalNetValue = this.getGroupTotal(value, group);
      const groupItemsQuantity = this.getGroupItemsQuantity(value);

      this.tableGroupStates[group].totalQty = groupItemsQuantity;
      this.tableGroupStates[group].totalNetPrice = groupTotalNetValue;

      this.tableSummaryState.totalPrice += groupTotalNetValue;
      this.tableSummaryState.totalQty += groupItemsQuantity;
    });
  }

  private getGroupTotal(
    value: { [key: string]: number },
    group: string
  ): number {
    let totalNetPrice = 0;
    for (const [itemKey, itemValue] of Object.entries(value)) {
      if (itemValue > 0) {
        const currentItem = this.accGroups[group].items.find(
          (item) => item.fifteen_digit === itemKey
        );

        const price = currentItem.price || 0;
        this.setCurrency(currentItem.currency);

        totalNetPrice += price * itemValue;
      }
    }

    return totalNetPrice;
  }

  private getGroupItemsQuantity(value: { [key: string]: number }): number {
    const qty = Object.values(value).reduce((curr, next) => curr + next, 0);

    return qty;
  }

  private setCurrency(currency: string): void {
    this.currency = currency;
  }

  private updateAccessoryithPriceAndAvailability(): void {
    this.accessories.forEach((accessory) => {
      const responseItem =
        this.priceAndAvailabilityResponses[accessory.pim_code];

      if (responseItem) {
        accessory.isPriceAndAvailabilityUpdated = true;
        accessory.price = responseItem.price ?? accessory.price;
        accessory.currency = responseItem.currency ?? accessory.currency;
        accessory.availability =
          responseItem.available ?? accessory.availability;
      }
    });
  }
}
