import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { Observable } from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getGqId } from '@gq/core/store/active-case/active-case.selectors';
import { QuotationMetadataActions } from '@gq/core/store/active-case/quotation-metadata/quotation-metadata.action';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { PushPipe } from '@ngrx/component';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { QuotationNoteModalData } from './quotation-note-modal-data.interface';

@Component({
  selector: 'gq-quotation-note-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DialogHeaderModule,
    SharedTranslocoModule,
    PushPipe,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    SharedPipesModule,
    LoadingSpinnerModule,
  ],
  templateUrl: './quotation-note-modal.component.html',
})
export class QuotationNoteModalComponent implements OnInit {
  // injections
  readonly #actions$: Actions = inject(Actions);
  readonly #destroyRef = inject(DestroyRef);
  readonly #store = inject(Store);
  modalData: QuotationNoteModalData = inject(
    MAT_DIALOG_DATA
  ) as QuotationNoteModalData;
  readonly #dialogRef: MatDialogRef<QuotationNoteModalComponent> = inject(
    MatDialogRef<QuotationNoteModalComponent>
  );

  // observables
  updateQuotationMetadataSuccess$: Observable<Action> = this.#actions$.pipe(
    ofType(QuotationMetadataActions.updateQuotationMetadataSuccess)
  );
  quotationMetadataLoading$ = this.#store.select(
    activeCaseFeature.selectQuotationMetadataLoading
  );
  gqId$ = this.#store.select(getGqId);

  // component properties
  quotationNoteForm: FormControl;
  readonly QUOTATION_NOTE_MAX_LENGTH = 1000;

  ngOnInit(): void {
    this.quotationNoteForm = new FormControl(
      {
        value: this.modalData.quotationMetadata?.note || '',
        disabled: !this.modalData.isQuotationStatusActive,
      },
      [Validators.maxLength(this.QUOTATION_NOTE_MAX_LENGTH)]
    );
  }

  closeDialog(): void {
    this.#dialogRef.close();
  }

  onConfirm(): void {
    this.#store.dispatch(
      QuotationMetadataActions.updateQuotationMetadata({
        quotationMetadata: {
          ...this.modalData.quotationMetadata,
          note: this.quotationNoteForm.value,
        },
      })
    );

    this.updateQuotationMetadataSuccess$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.closeDialog());
  }

  onCancel(): void {
    this.closeDialog();
  }
}
