import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { ICellRendererParams } from 'ag-grid-community';

import { AppRoutePath } from '../../../../../app-route-path.enum';
import {
  resetAutocompleteMaterials,
  setRequestingAutoCompleteDialog,
  updateMaterialRowDataItem,
  updateRowDataItem,
} from '../../../../../core/store';
import { AutocompleteRequestDialog } from '../../../../components/autocomplete-input/autocomplete-request-dialog.enum';
import { EditingMaterialModalComponent } from '../../../../components/modal/editing-material-modal/editing-material-modal.component';
import { MaterialTableItem } from '../../../../models/table';
import { FeatureToggleConfigService } from '../../../../services/feature-toggle/feature-toggle-config.service';

@Component({
  selector: 'gq-edit-case-material',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './edit-case-material.component.html',
})
export class EditCaseMaterialComponent {
  public params: ICellRendererParams;
  public cellValue: string;
  public showEditMaterialButtonEnabled: boolean;
  public isCaseView: boolean;

  constructor(
    private readonly featureToggleService: FeatureToggleConfigService,
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly router: Router
  ) {
    this.showEditMaterialButtonEnabled = this.featureToggleService.isEnabled(
      'showEditMaterialButton'
    );
    this.isCaseView = this.router.url === `/${AppRoutePath.CaseViewPath}`;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;

    this.cellValue = this.getValueToDisplay(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);

    return true;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ?? params.value;
  }

  onIconClick(): void {
    this.dialog
      .open(EditingMaterialModalComponent, {
        width: '660px',
        data: {
          material: this.params.data,
          field: this.params.colDef.field,
        },
      })
      .afterClosed()
      .subscribe((result: MaterialTableItem) => {
        if (result) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          this.isCaseView
            ? this.store.dispatch(updateRowDataItem({ item: result }))
            : this.store.dispatch(updateMaterialRowDataItem({ item: result }));
        }

        this.store.dispatch(resetAutocompleteMaterials());

        this.store.dispatch(
          setRequestingAutoCompleteDialog({
            dialog: AutocompleteRequestDialog.ADD_ENTRY,
          })
        );
      });
  }
}
