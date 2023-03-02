import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import {
  getIsQuotationActive,
  getSimulationModeEnabled,
} from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { AddMaterialDialogComponent } from '../../../../process-case-view/add-material-dialog/add-material-dialog.component';

@Component({
  selector: 'gq-add-items-button',
  templateUrl: './add-items-button.component.html',
  styles: [],
})
export class AddItemsButtonComponent implements OnInit {
  simulationModeEnabled$: Observable<boolean>;
  quotationActive$: Observable<boolean>;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  agInit(): void {}

  ngOnInit(): void {
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
    this.quotationActive$ = this.store.select(getIsQuotationActive);
  }

  showAddDialog(): void {
    this.dialog.open(AddMaterialDialogComponent, {
      width: '70%',
      height: '75%',
    });
  }
}
