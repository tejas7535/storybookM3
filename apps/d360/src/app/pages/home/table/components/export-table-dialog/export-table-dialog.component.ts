import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
} from '@angular/material/dialog';

import { tap } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ExportMaterialCustomerService } from '../../services/export-material-customer.service';
import { ExportTableDialogData } from './export-table-dialog.model';

@Component({
  selector: 'd360-export-table-dialog',
  imports: [LoadingSpinnerModule, TranslocoModule, MatDialogContent],
  templateUrl: './export-table-dialog.component.html',
})
export class ExportTableDialogComponent implements OnInit {
  private readonly exportMaterialCustomerService = inject(
    ExportMaterialCustomerService
  );
  private readonly data: ExportTableDialogData = inject(MAT_DIALOG_DATA);
  private readonly dialog: MatDialog = inject(MatDialog);

  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit() {
    this.exportMaterialCustomerService
      .triggerExport(this.data.gridApi, this.data.filter)
      .pipe(
        tap(() => this.dialog.closeAll()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
