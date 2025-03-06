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
import { MatTooltipModule } from '@angular/material/tooltip';

import { firstValueFrom, Subject } from 'rxjs';

import { CalculationTypeChangeEvent } from '@ea/core/services/google-analytics';
import { TrackingService } from '@ea/core/services/tracking-service/tracking.service';
import {
  CalculationParametersFacade,
  ProductSelectionFacade,
} from '@ea/core/store';
import { CalculationTypesActions } from '@ea/core/store/actions';
import { CalculationParametersCalculationTypeConfig } from '@ea/core/store/models';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BasicFrequenciesComponent } from '../basic-frequencies/basic-frequencies.component';

@Component({
  selector: 'ea-calculation-types-selection',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    PushPipe,
    SharedTranslocoModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  providers: [
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions,
    },
  ],
  templateUrl: './calculation-types-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationTypesSelectionComponent implements OnDestroy {
  public isInDialog = this.dialogRef?.id !== undefined;
  public calculationTypesConfig$ =
    this.calculationParametersFacade.getCalculationTypesConfig$;
  public getCalculationTypesGlobalSelection$ =
    this.calculationParametersFacade.getCalculationTypesGlobalSelection$;
  public isCo2DownstreamCalculationPossible$ =
    this.productSelectionFacade.isCo2DownstreamCalculationPossible$;
  public readonly CALCULATION_TYPE_CO2 = 'emission';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly matDialog: MatDialog,
    private readonly trackingService: TrackingService,
    @Optional()
    public readonly dialogRef?: MatDialogRef<CalculationTypesSelectionComponent>
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public async selectAllChanged(selectAll: boolean) {
    this.calculationParametersFacade.dispatch(
      CalculationTypesActions.selectAll({ selectAll })
    );

    // track changed items
    const config = await firstValueFrom(this.calculationTypesConfig$);
    const nonDisabledItems = config.filter((item) => !item.disabled);
    const methods: CalculationTypeChangeEvent['methods'] = {};
    for (const item of nonDisabledItems) {
      methods[item.name] = item.selected !== selectAll;
    }
    this.trackingService.logToggleCalculationType(selectAll, methods);
  }

  public selectionChanged(
    select: boolean,
    config: CalculationParametersCalculationTypeConfig,
    configs: CalculationParametersCalculationTypeConfig[]
  ) {
    this.calculationParametersFacade.dispatch(
      CalculationTypesActions.selectType({
        select,
        calculationType: config.name,
      })
    );

    // track changed items
    const nonDisabledItems = configs.filter((item) => !item.disabled);
    const methods: CalculationTypeChangeEvent['methods'] = {};
    for (const item of nonDisabledItems) {
      methods[item.name] = item.name === config.name;
    }
    this.trackingService.logToggleCalculationType(select, methods);
  }

  public onShowBasicFrequenciesDialogClick(): void {
    this.matDialog.open(BasicFrequenciesComponent);
  }
}
