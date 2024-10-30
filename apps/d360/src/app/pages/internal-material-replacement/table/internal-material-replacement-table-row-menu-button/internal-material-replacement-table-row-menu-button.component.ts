import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuItem } from '@angular/material/menu';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { IMRSubstitution } from '../../../../feature/internal-material-replacement/model';
import { RowMenuComponent } from '../../../../shared/components/ag-grid/row-menu/row-menu.component';
import { InternalMaterialReplacementSingleDeleteModalComponent } from '../../components/modals/internal-material-replacement-single-delete-modal/internal-material-replacement-single-delete-modal.component';
import { InternalMaterialReplacementSingleSubstitutionModalComponent } from '../../components/modals/internal-material-replacement-single-substitution-modal/internal-material-replacement-single-substitution-modal.component';

@Component({
  selector: 'app-internal-material-replacement-table-row-menu-button',
  standalone: true,
  imports: [CommonModule, RowMenuComponent, MatMenuItem, SharedTranslocoModule],
  templateUrl:
    './internal-material-replacement-table-row-menu-button.component.html',
  styleUrl:
    './internal-material-replacement-table-row-menu-button.component.scss',
})
export class InternalMaterialReplacementTableRowMenuButtonComponent extends RowMenuComponent<IMRSubstitution> {
  constructor(private readonly dialog: MatDialog) {
    super();
  }

  edit() {
    this.dialog.open(
      InternalMaterialReplacementSingleSubstitutionModalComponent,
      {
        data: {
          substitution: this.data,
          isNewSubstitution: false,
          gridApi: this.params.api,
        },
        disableClose: true,
      }
    );
  }

  delete() {
    const dialogRef = this.dialog.open(
      InternalMaterialReplacementSingleDeleteModalComponent,
      {
        data: this.data,
        disableClose: true,
      }
    );
    // TODO check if this works we need to update the row data in ag-grid
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.params.api.applyServerSideTransaction({
          remove: [this.params.node.id],
        });
      }
    });
  }
}
