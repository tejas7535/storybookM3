import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { Observable } from 'rxjs';

import {
  getIsQuotationActive,
  getSimulationModeEnabled,
} from '@gq/core/store/active-case/active-case.selectors';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { AddMaterialDialogComponent } from '@gq/process-case-view/add-material-dialog/add-material-dialog.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-add-items-button',
  templateUrl: './add-items-button.component.html',
  styles: [],
})
export class AddItemsButtonComponent implements OnInit {
  simulationModeEnabled$: Observable<boolean>;
  quotationActive$: Observable<boolean>;

  constructor(
    public readonly approvalFacade: ApprovalFacade,
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
