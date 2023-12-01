import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs';

import {
  QuickFilter,
  QuickFilterType,
} from '@mac/feature/materials-supplier-database/models';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

@Component({
  selector: 'mac-quickfilter-dialog',
  templateUrl: './quickfilter-dialog.component.html',
})
export class QuickfilterDialogComponent implements OnInit, OnDestroy {
  // set quickfilter title
  titleControl = new FormControl<string>(undefined, [Validators.required]);

  // set quickfilter description. Needed only for public filters!
  descriptionControl = new FormControl<string>(undefined, [
    Validators.required,
  ]);

  // Needed to choose the quick filter type
  radioControl = new FormControl<QuickFilterType>(
    QuickFilterType.LOCAL_FROM_CURRENT_VIEW,
    [Validators.required]
  );

  // form group
  formGroup: FormGroup<{
    title: FormControl<string>;
    quickFilterType: FormControl<QuickFilterType>;
    description?: FormControl<string>;
  }>;

  add = false;
  edit = false;
  delete = false;

  operationButtonTranslationKeySuffix: string;

  readonly quickFilterType = QuickFilterType;
  readonly hasEditorRole$ = this.dataFacade.hasEditorRole$;

  private readonly destroy$ = new Subject<void>();

  constructor(
    readonly dialogRef: MatDialogRef<QuickfilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      quickFilter: QuickFilter;
      edit: boolean;
      delete: boolean;
    },
    private readonly dataFacade: DataFacade
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      title: this.titleControl,
      quickFilterType: this.radioControl,
    });

    this.titleControl.setValue(this.data.quickFilter?.title);
    this.descriptionControl.setValue(this.data.quickFilter?.description);
    this.radioControl.setValue(QuickFilterType.LOCAL_FROM_CURRENT_VIEW);

    if (this.data.delete) {
      this.delete = true;
      this.radioControl.disable();
    } else if (this.data.edit) {
      this.edit = true;
      this.radioControl.disable();

      if (this.data.quickFilter?.id) {
        this.formGroup.addControl('description', this.descriptionControl); // Description is available only for published filters
      }
    } else {
      this.add = true;
    }

    this.determineOperationButtonTranslationKeySuffix();
    this.handleQuickFilterTypeChanges();
  }

  // on cancel dialog
  closeDialog(): void {
    this.dialogRef.close();
  }

  // on apply / save dialog
  applyDialog(): void {
    const result = {
      ...this.formGroup.value,
      edit: this.edit,
      delete: this.delete,
    };
    this.dialogRef.close(result);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.applyDialog();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleQuickFilterTypeChanges(): void {
    this.radioControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((quickFilterType: QuickFilterType) => {
        this.determineOperationButtonTranslationKeySuffix();

        if (quickFilterType === QuickFilterType.PUBLIC) {
          this.formGroup.addControl('description', this.descriptionControl);
        } else {
          this.formGroup.removeControl('description');
        }
      });
  }

  private determineOperationButtonTranslationKeySuffix(): void {
    if (this.radioControl.value === QuickFilterType.PUBLIC) {
      this.operationButtonTranslationKeySuffix = 'confirm_publish';
    } else if (this.edit) {
      this.operationButtonTranslationKeySuffix = 'confirm_edit';
    } else if (this.add) {
      this.operationButtonTranslationKeySuffix = 'confirm_add';
    } else if (this.delete) {
      this.operationButtonTranslationKeySuffix = 'confirm_delete';
    }
  }
}
