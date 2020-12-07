import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';

import {
  addToRemoveMaterials,
  removeMaterials,
} from '../../../core/store/actions';
import { QuotationDetail } from '../../../core/store/models';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';
import { getSapId } from '../../../core/store/selectors';
import { AddMaterialDialogComponent } from '../../../process-case-view/add-material-dialog/add-material-dialog.component';

@Component({
  selector: 'gq-flat-buttons',
  templateUrl: './flat-buttons.component.html',
  styleUrls: ['./flat-buttons.component.scss'],
})
export class FlatButtonsComponent implements OnInit {
  selections: any[] = [];

  private params: IStatusPanelParams;
  sap: boolean;

  public constructor(
    private readonly store: Store<ProcessCaseState>,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.pipe(select(getSapId)).subscribe((value) => {
      this.sap = !!value;
    });
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;

    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }

  onGridReady(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  showAddDialog(): void {
    this.dialog.open(AddMaterialDialogComponent, {
      width: '70%',
      height: '75%',
    });
  }

  removeMaterials(): void {
    const gqPositionIds: string[] = [];
    this.selections.forEach((value: QuotationDetail) => {
      gqPositionIds.push(value.gqPositionId);
    });

    this.store.dispatch(addToRemoveMaterials({ gqPositionIds }));
    this.store.dispatch(removeMaterials());
    this.selections = [];
  }
}
