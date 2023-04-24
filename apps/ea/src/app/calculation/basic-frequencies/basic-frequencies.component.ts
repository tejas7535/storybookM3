import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { Observable } from 'rxjs';

import { CatalogCalculationResultActions } from '@ea/core/store/actions';
import { CatalogCalculationResultFacade } from '@ea/core/store/facades/calculation-result/catalog-calculation-result.facade';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import { BasicFrequenciesResult } from '@ea/core/store/models';
import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  templateUrl: './basic-frequencies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    PushModule,
    SharedTranslocoModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
})
export class BasicFrequenciesComponent implements OnInit {
  public readonly bearingDesignation$: Observable<string>;
  public readonly basicFrequencies$: Observable<BasicFrequenciesResult>;
  public readonly isLoading$: Observable<boolean>;

  public readonly columnsToDisplay = ['name', 'abbreviation', 'value'];

  constructor(
    private readonly catalogCalculationResultFacade: CatalogCalculationResultFacade,
    public readonly dialogRef: MatDialogRef<BasicFrequenciesComponent>,
    productSelectionFacade: ProductSelectionFacade
  ) {
    this.basicFrequencies$ =
      this.catalogCalculationResultFacade.basicFrequencies$;
    this.bearingDesignation$ = productSelectionFacade.bearingDesignation$;
    this.isLoading$ = this.catalogCalculationResultFacade.isLoading$;
  }

  ngOnInit(): void {
    this.catalogCalculationResultFacade.dispatch(
      CatalogCalculationResultActions.fetchBasicFrequencies()
    );
  }

  public saveAsPdf() {
    this.catalogCalculationResultFacade.dispatch(
      CatalogCalculationResultActions.downloadBasicFrequencies()
    );
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
