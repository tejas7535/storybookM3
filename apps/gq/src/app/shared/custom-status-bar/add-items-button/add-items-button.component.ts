import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getSapId, getSimulationModeEnabled } from '../../../core/store';
import { AddMaterialDialogComponent } from '../../../process-case-view/add-material-dialog/add-material-dialog.component';

@Component({
  selector: 'gq-add-items-button',
  templateUrl: './add-items-button.component.html',
  styles: [],
})
export class AddItemsButtonComponent implements OnInit {
  sapId$: Observable<string>;
  simulationModeEnabled$: Observable<boolean>;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  agInit(): void {}
  ngOnInit(): void {
    this.sapId$ = this.store.select(getSapId);
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
  }
  showAddDialog(): void {
    this.dialog.open(AddMaterialDialogComponent, {
      width: '70%',
      height: '75%',
    });
  }
}
