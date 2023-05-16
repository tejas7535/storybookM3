import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  Optional,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_CHECKBOX_DEFAULT_OPTIONS,
  MatCheckboxDefaultOptions,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { Subject } from 'rxjs';

import { CalculationParametersFacade } from '@ea/core/store';
import { CalculationTypesActions } from '@ea/core/store/actions';
import { CalculationParametersCalculationTypeConfig } from '@ea/core/store/models';
import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BasicFrequenciesComponent } from '../basic-frequencies/basic-frequencies.component';

@Component({
  selector: 'ea-calculation-types-selection',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    PushModule,
    SharedTranslocoModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule,
    MatDividerModule,
  ],
  providers: [
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions,
    },
  ],
  templateUrl: './calculation-types-selection.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationTypesSelectionComponent implements OnDestroy {
  public isInDialog = this.dialogRef?.id !== undefined;
  public calculationTypesConfig$ =
    this.calculationParametersFacade.getCalculationTypesConfig$;
  public getCalculationTypesGlobalSelection$ =
    this.calculationParametersFacade.getCalculationTypesGlobalSelection$;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly matDialog: MatDialog,
    @Optional()
    public readonly dialogRef?: MatDialogRef<CalculationTypesSelectionComponent>
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public selectAllChanged(selectAll: boolean) {
    this.calculationParametersFacade.dispatch(
      CalculationTypesActions.selectAll({ selectAll })
    );
  }

  public selectionChanged(
    select: boolean,
    config: CalculationParametersCalculationTypeConfig
  ) {
    this.calculationParametersFacade.dispatch(
      CalculationTypesActions.selectType({
        select,
        calculationType: config.name,
      })
    );
  }

  public onShowBasicFrequenciesDialogClick(): void {
    this.matDialog.open(BasicFrequenciesComponent);
  }
}
