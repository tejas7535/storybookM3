import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Subject, take, takeUntil } from 'rxjs';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { REFERENCE_DOCUMENT } from '@mac/feature/materials-supplier-database/constants';
import { DataResult } from '@mac/feature/materials-supplier-database/models';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

import { BaseDialogComponent } from '../../../base-dialog/base-dialog.component';
import { Co2ComponentComponent } from '../../../components/co2-component/co2-component.component';
import { ManufacturerSupplierComponent } from '../../../components/manufacturer-supplier/manufacturer-supplier.component';
import { MaterialStandardComponent } from '../../../components/material-standard/material-standard.component';
import { RecyclingRateComponent } from '../../../components/recycline-rate/recycling-rate.component';

@Component({
  selector: 'mac-reference-document-bulk-edit-dialog',
  templateUrl: './reference-document-bulk-edit-dialog.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    BaseDialogComponent,
    MaterialStandardComponent,
    ManufacturerSupplierComponent,
    Co2ComponentComponent,
    RecyclingRateComponent,
    // angular material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    // libs
    SelectModule,
    SharedTranslocoModule,
    // ngrx
    PushPipe,
    LetDirective,
  ],
})
export class ReferenceDocumentBulkEditDialogComponent
  implements OnInit, OnDestroy
{
  allReferenceDocumentsFiltered: string[] = [];

  selectedReferenceDocumentToEntriesCount: {
    [selectedReferenceDocument: string]: number;
  } = {};

  selectedReferenceDocuments: string[] = [];

  searchControl: FormControl<string> = new FormControl();
  addingEntry = false;

  private readonly allReferenceDocuments = new Set<string>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly dialogData: {
      selectedRows: DataResult[];
    },
    private readonly dialogRef: MatDialogRef<ReferenceDocumentBulkEditDialogComponent>,
    private readonly dataFacade: DataFacade,
    private readonly dialogFacade: DialogFacade
  ) {}

  ngOnInit(): void {
    this.determineAllReferenceDocuments();
    this.determineSelectedReferenceDocumentsSummary();
    this.handleSearchExpressionChanges();

    this.dialogFacade.bulkEditMaterialsSucceeded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.close());
  }

  onConfirmAddEntry(value: string): void {
    const valueTrimmed = value?.trim();

    if (valueTrimmed) {
      this.allReferenceDocuments.add(valueTrimmed);
      this.allReferenceDocumentsFiltered = [
        ...this.allReferenceDocuments,
      ].sort();
    }

    this.addingEntry = false;
  }

  handleCheckboxChange(checked: boolean, referenceDocument: string): void {
    if (checked) {
      this.handleReferenceDocumentChecked(referenceDocument);
    } else {
      this.handleReferenceDocumentUnchecked(referenceDocument);
    }
  }

  updateMaterials(): void {
    this.dialogFacade.bulkEditMaterials(this.dialogData.selectedRows);
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private determineAllReferenceDocuments(): void {
    this.dataFacade.result$.pipe(take(1)).subscribe((data) => {
      data.forEach((dataItem: any) =>
        dataItem[REFERENCE_DOCUMENT]?.forEach((referenceDocument: string) =>
          this.allReferenceDocuments.add(referenceDocument)
        )
      );
      this.allReferenceDocumentsFiltered = [
        ...this.allReferenceDocuments,
      ].sort();
    });
  }

  private determineSelectedReferenceDocumentsSummary(): void {
    this.dialogData.selectedRows.forEach((selectedTableRowsDataItem) =>
      selectedTableRowsDataItem[REFERENCE_DOCUMENT]?.forEach(
        (referenceDocument: string) => {
          const currentEntriesCount =
            this.selectedReferenceDocumentToEntriesCount[referenceDocument] ||
            0;
          this.selectedReferenceDocumentToEntriesCount[referenceDocument] =
            currentEntriesCount + 1;
        }
      )
    );

    this.selectedReferenceDocuments = Object.keys(
      this.selectedReferenceDocumentToEntriesCount
    ).sort();
  }

  private handleSearchExpressionChanges(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchExpression: string) => {
        const searchExpressionFormatted = searchExpression.toLowerCase().trim();

        this.allReferenceDocumentsFiltered = searchExpressionFormatted
          ? [...this.allReferenceDocuments].filter(
              (referenceDocument: string) =>
                referenceDocument
                  .toLowerCase()
                  .trim()
                  .includes(searchExpressionFormatted)
            )
          : [...this.allReferenceDocuments].sort();
      });
  }

  private handleReferenceDocumentChecked(
    checkedReferenceDocument: string
  ): void {
    if (!this.selectedReferenceDocuments.includes(checkedReferenceDocument)) {
      this.selectedReferenceDocuments = [
        ...this.selectedReferenceDocuments,
        checkedReferenceDocument,
      ].sort();
    }

    this.selectedReferenceDocumentToEntriesCount = {
      ...this.selectedReferenceDocumentToEntriesCount,
      [checkedReferenceDocument]: this.dialogData.selectedRows.length,
    };

    this.dialogData.selectedRows = this.dialogData.selectedRows.map(
      (selectedTableRowsDataItem) => {
        const referenceDocuments: string[] =
          selectedTableRowsDataItem[REFERENCE_DOCUMENT];

        return {
          ...selectedTableRowsDataItem,
          [REFERENCE_DOCUMENT]: referenceDocuments?.includes(
            checkedReferenceDocument
          )
            ? referenceDocuments
            : [...(referenceDocuments || []), checkedReferenceDocument],
        };
      }
    );
  }

  private handleReferenceDocumentUnchecked(
    uncheckedReferenceDocument: string
  ): void {
    this.selectedReferenceDocuments = this.selectedReferenceDocuments.filter(
      (selectedReferenceDocument: string) =>
        selectedReferenceDocument !== uncheckedReferenceDocument
    );

    this.selectedReferenceDocumentToEntriesCount = {
      ...this.selectedReferenceDocumentToEntriesCount,
      [uncheckedReferenceDocument]: 0,
    };

    this.dialogData.selectedRows = this.dialogData.selectedRows.map(
      (selectedTableRowsDataItem) => ({
        ...selectedTableRowsDataItem,
        [REFERENCE_DOCUMENT]: selectedTableRowsDataItem[
          REFERENCE_DOCUMENT
        ].filter(
          (referenceDocument: string) =>
            referenceDocument !== uncheckedReferenceDocument
        ),
      })
    );
  }
}
