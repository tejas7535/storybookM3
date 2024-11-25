import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { TranslocoDirective } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { DemandValidationFilter } from '../../../../feature/demand-validation/demand-validation-filters';
import { SelectedKpis } from '../../../../feature/demand-validation/model';
import { DateRange } from '../../../../shared/utils/date-range';
import { ExportDemandValidationService } from '../../services/export-demand-validation.service';

export interface DemandValidationExportModalProps {
  selectedKpis: SelectedKpis;
  filledRange: { range1: DateRange; range2?: DateRange } | undefined;
  demandValidationFilters: DemandValidationFilter;
}

@Component({
  selector: 'd360-demand-validation-export-loading-modal',
  standalone: true,
  imports: [LoadingSpinnerModule, TranslocoDirective],
  templateUrl: './demand-validation-export-loading-modal.component.html',
})
export class DemandValidationExportLoadingModalComponent implements OnInit {
  private readonly demandValidationExportService = inject(
    ExportDemandValidationService
  );

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  protected readonly data = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    this.demandValidationExportService
      .triggerExport(
        this.data.selectedKpis,
        this.data.filledRange,
        this.data.demandValidationFilters
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialog.closeAll();
      });
  }
}
