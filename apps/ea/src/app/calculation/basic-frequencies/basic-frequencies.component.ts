import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { Observable } from 'rxjs';

import {
  downloadBasicFrequencies,
  fetchBasicFrequencies,
} from '@ea/core/store/actions/calculation-result/calculation-result.actions';
import { CalculationResultFacade } from '@ea/core/store/facades/calculation-result/calculation-result.facade';
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
    private readonly calculationResultFacade: CalculationResultFacade,
    public readonly dialogRef: MatDialogRef<BasicFrequenciesComponent>,
    productSelectionFacade: ProductSelectionFacade
  ) {
    this.basicFrequencies$ = this.calculationResultFacade.basicFrequencies$;
    this.bearingDesignation$ = productSelectionFacade.bearingDesignation$;
    this.isLoading$ = this.calculationResultFacade.isCalculationLoading$;
  }

  ngOnInit(): void {
    this.calculationResultFacade.dispatch(fetchBasicFrequencies());
  }

  public saveAsPdf() {
    this.calculationResultFacade.dispatch(downloadBasicFrequencies());
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
