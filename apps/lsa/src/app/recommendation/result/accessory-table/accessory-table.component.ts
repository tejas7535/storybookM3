/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule, JsonPipe, KeyValuePipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Subject, takeUntil } from 'rxjs';

import { environment } from '@lsa/environments/environment';
import { Accessory, AccessoryClassEntry } from '@lsa/shared/models';
import { MediasCallbackResponse } from '@lsa/shared/models/price-availibility.model';
import { PushPipe } from '@ngrx/component';

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
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    KeyValuePipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    PushPipe,
    JsonPipe,
    SharedTranslocoModule,
    SortedAccessoryListPipe,
  ],
})
export class AccessoryTableComponent implements OnChanges, OnDestroy {
  @Input()
  public readonly accessories: Accessory[];

  @Input()
  public readonly classPriorities: AccessoryClassEntry[];

  @Input()
  public priceAndAvailability: MediasCallbackResponse;

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
  public currency = 'EUR';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.classPriorities?.currentValue) {
      this.transformPriorities();
    }

    if (changes.accessories.currentValue) {
      this.formUpdate$.next();
      this.accGroups = {};
      this.tableGroupStates = {};
      this.tableSummaryState = { totalQty: 0 };
      this.generateAccessoriesForInput();
      this.showEmptyState = false;
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

    this.tableFormGroup.valueChanges
      .pipe(takeUntil(this.formUpdate$))
      .subscribe((newValue) => {
        this.tableSummaryState.totalQty = 0;
        this.tableSummaryState.totalPrice = 0;

        for (const [key, value] of Object.entries(newValue)) {
          const qty = Object.values(value).reduce(
            (curr, next) => curr + next,
            0
          );

          let totalNetPrice = 0;
          for (const [itemKey, itemValue] of Object.entries(value)) {
            if (itemValue > 0) {
              const currentItem = this.accGroups[key].items.find(
                (item) => item.fifteen_digit === itemKey
              );

              totalNetPrice += currentItem.price * itemValue;
            }
          }

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
        isOpen: totalQty > 0,
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

  private setCurrency(currency: string): void {
    if (currency === '€') {
      this.currency = 'EUR';
    } else if (currency === '$') {
      this.currency = 'USD';
    } else {
      // fallback to EUR
      this.currency = 'EUR';
    }
  }
}
