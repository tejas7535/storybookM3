import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getIsQuotationStatusActive } from '@gq/core/store/active-case/active-case.selectors';
import { QuotationMetadata } from '@gq/shared/models/quotation/quotation-metadata.interface';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { QuotationNoteModalComponent } from '../modal/quotation-note-modal.component';
import { QuotationNoteModalData } from '../modal/quotation-note-modal-data.interface';

@Component({
  selector: 'gq-quotation-note-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule, PushPipe, LetDirective],
  templateUrl: './quotation-note-icon.component.html',
})
export class QuotationNoteIconComponent {
  readonly #store = inject(Store);
  readonly #matDialog: MatDialog = inject(MatDialog);

  quotationStatusActive$ = this.#store.select(getIsQuotationStatusActive);
  quotation$ = this.#store.select(activeCaseFeature.selectQuotation);

  openQuotationNoteModal(
    quotationMetadata: QuotationMetadata,
    isQuotationStatusActive: boolean
  ): void {
    this.#matDialog.open(QuotationNoteModalComponent, {
      width: '491px',
      height: '300px',
      data: {
        quotationMetadata,
        isQuotationStatusActive,
      } as QuotationNoteModalData,
    });
  }
}
