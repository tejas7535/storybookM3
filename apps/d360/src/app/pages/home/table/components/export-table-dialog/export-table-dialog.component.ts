import { Component, DestroyRef, Inject, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { TranslocoModule } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ExportMaterialCustomerService } from '../../services/export-material-customer.service';
import { ExportTableDialogData } from './export-table-dialog.model';

@Component({
  selector: 'd360-export-table-dialog',
  standalone: true,
  imports: [LoadingSpinnerModule, TranslocoModule],
  templateUrl: './export-table-dialog.component.html',
  styleUrl: './export-table-dialog.component.scss',
})
export class ExportTableDialogComponent implements OnInit {
  private readonly exportMaterialCustomerService = inject(
    ExportMaterialCustomerService
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ExportTableDialogData,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.exportMaterialCustomerService
      .triggerExport(this.data.gridApi, this.data.columnApi, this.data.filter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialog.closeAll();
      });
  }
}
