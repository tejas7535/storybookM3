import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { combineLatest, map, Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { AddMaterialDialogComponent } from '@gq/process-case-view/add-material-dialog/add-material-dialog.component';
import { QuotationStatus, SAP_SYNC_STATUS } from '@gq/shared/models';

import { getTooltipTextKeyByQuotationStatus } from '../statusbar.utils';

@Component({
  selector: 'gq-add-items-button',
  templateUrl: './add-items-button.component.html',
  styles: [],
})
export class AddItemsButtonComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly destroyRef = inject(DestroyRef);

  simulationModeEnabled$: Observable<boolean> =
    this.activeCaseFacade.simulationModeEnabled$;
  tooltipText$: Observable<string>;

  quotationEditable$: Observable<boolean> =
    this.activeCaseFacade.canEditQuotation$;

  agInit(): void {
    this.tooltipText$ = this.getTooltipTextKey();
  }

  showAddDialog(): void {
    this.dialog.open(AddMaterialDialogComponent, {
      width: '71%',
      height: '75%',
    });
  }

  private getTooltipTextKey(): Observable<string> {
    return combineLatest([
      this.activeCaseFacade.quotationStatus$,
      this.activeCaseFacade.quotationSapSyncStatus$,
    ]).pipe(
      takeUntilDestroyed(this.destroyRef),
      map(
        ([quotationStatus, sapSyncStatus]: [
          QuotationStatus,
          SAP_SYNC_STATUS,
        ]) =>
          getTooltipTextKeyByQuotationStatus(
            quotationStatus,
            null,
            null,
            sapSyncStatus
          )
      )
    );
  }
}
