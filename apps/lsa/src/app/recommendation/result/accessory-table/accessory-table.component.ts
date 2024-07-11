/* eslint-disable @typescript-eslint/member-ordering */
import { JsonPipe, KeyValuePipe } from '@angular/common';
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

import { Accessory } from '@lsa/shared/models';
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

@Component({
  selector: 'lsa-accessory-table',
  templateUrl: './accessory-table.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    KeyValuePipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    PushPipe,
    JsonPipe,
    SharedTranslocoModule,
  ],
})
export class AccessoryTableComponent implements OnChanges, OnDestroy {
  @Input()
  public readonly accessories: Accessory[];

  public tableFormGroup!: AccessoryTableFormGroup;

  public accGroups: AccessoryTable;
  public tableGroupStates: { [key: string]: TableGroupState };
  public tableSummaryState: { totalQty: number; totalPrice?: number } = {
    totalQty: 0,
  };

  private readonly destroy$ = new Subject<void>();
  private readonly formUpdate$ = new Subject<void>();

  public showEmptyState = true;

  ngOnChanges(changes: SimpleChanges): void {
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
  }

  generateAccessoriesForInput(): void {
    this.accGroups = transformAccessories(this.accessories);
    this.tableFormGroup = generateFormGroup(this.accGroups);

    this.tableFormGroup.valueChanges
      .pipe(takeUntil(this.formUpdate$))
      .subscribe((newValue) => {
        this.tableSummaryState.totalQty = 0;
        for (const [key, value] of Object.entries(newValue)) {
          const qty = Object.values(value).reduce(
            (curr, next) => curr + next,
            0
          );
          // TODO: update price
          this.tableSummaryState.totalQty += qty;
          this.tableGroupStates[key].totalQty = qty;
        }
      });

    const states: { [key: string]: TableGroupState } = {};

    Object.entries(this.accGroups).forEach(([group, value]) => {
      const totalQty = value.items.reduce(
        (prev, current) => prev + current.qty,
        0
      );
      const totalNetPrice = value.items
        .filter((acc) => acc.price)
        .reduce((prev, current) => prev + current.price, 0);

      states[group] = { isOpen: true, totalQty, totalNetPrice };

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
}
