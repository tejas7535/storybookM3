import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { select, Store } from '@ngrx/store';

import { setGreaseDisplay } from '../../core/store/actions/';
import { GreaseStatusState } from '../../core/store/reducers/grease-status/grease-status.reducer';
import {
  GreaseDisplay,
  GreaseStatus,
} from '../../core/store/reducers/grease-status/models';
import {
  getGreaseDisplay,
  getGreaseStatusResult,
} from '../../core/store/selectors/';

interface Checkbox {
  label: string;
  formControl: string;
}

@Component({
  selector: 'goldwind-grease-status-monitoring',
  templateUrl: './grease-status.component.html',
  styleUrls: ['./grease-status.component.scss'],
})
export class GreaseStatusComponent implements OnInit, OnDestroy {
  greaseStatus$: Observable<GreaseStatus>;
  public modules = [ClientSideRowModelModule];
  public columnDefs = [
    { field: 'id' },
    { field: 'sensorId' },
    { field: 'startDate' },
    { field: 'endDate' },
    { field: 'waterContentPercent' },
    { field: 'deteriorationPercent' },
    { field: 'temperatureCelsius' },
    { field: 'isAlarm' },
    { field: 'sampleRatio' },
  ];

  public checkBoxes: Checkbox[] = [
    { label: 'waterContent', formControl: 'waterContentPercent' },
    { label: 'deteroration', formControl: 'deteriorationPercent' },
    { label: 'greaseTemperatur', formControl: 'temperatureCelsius' },
    { label: 'rotationalSpeed', formControl: 'rotationalSpeed' },
  ];

  displayForm = new FormGroup({
    waterContentPercent: new FormControl(''),
    deteriorationPercent: new FormControl(''),
    temperatureCelsius: new FormControl(''),
    rotationalSpeed: new FormControl(''),
  });

  private readonly subscription: Subscription = new Subscription();

  public constructor(private readonly store: Store<GreaseStatusState>) {}

  ngOnInit(): void {
    this.greaseStatus$ = this.store.pipe(select(getGreaseStatusResult));
    this.subscription.add(
      this.store
        .pipe(select(getGreaseDisplay))
        .subscribe((greaseDisplay: GreaseDisplay) => {
          this.displayForm.markAsPristine();
          this.displayForm.setValue(greaseDisplay);
        })
    );

    this.displayForm.valueChanges
      .pipe(filter(() => this.displayForm.dirty))
      .subscribe((greaseDisplay: GreaseDisplay) =>
        this.store.dispatch(setGreaseDisplay({ greaseDisplay }))
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
