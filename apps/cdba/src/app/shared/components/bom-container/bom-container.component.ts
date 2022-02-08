import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ExcelCell, GridApi } from '@ag-grid-enterprise/all-modules';
import * as fromCompare from '@cdba/compare/store';
import * as fromDetail from '@cdba/core/store';
import { MaterialNumberPipe } from '@cdba/shared/pipes';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { BomItem, Calculation } from '../../models';

@Component({
  selector: 'cdba-bom-container',
  templateUrl: './bom-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BomContainerComponent implements OnInit {
  @Input() index: number;

  materialDesignation$: Observable<string>;
  materialDesignation: string;

  // Calculation Variables
  calculations$: Observable<Calculation[]>;
  selectedCalculationNodeId$: Observable<string[]>;
  selectedCalculation$: Observable<Calculation>;
  calculationsLoading$: Observable<boolean>;
  calculationsErrorMessage$: Observable<string>;

  selectedCalculation: Calculation;

  // Bom Variables
  bomLoading$: Observable<boolean>;
  bomErrorMessage$: Observable<string>;
  childrenOfSelectedBomItem$: Observable<BomItem[]>;
  bomItems$: Observable<BomItem[]>;

  private gridApi: GridApi;

  public constructor(
    private readonly store: Store,
    private readonly applicationInsights: ApplicationInsightsService,
    private readonly localeService: TranslocoLocaleService
  ) {}

  public ngOnInit(): void {
    if (this.index !== undefined) {
      this.initializeWithCompareSelectors();
    } else {
      this.initializeWithDetailSelectors();
    }
  }

  public selectCalculation(
    event: {
      nodeId: string;
      calculation: Calculation;
    }[]
  ): void {
    if (this.index !== undefined) {
      this.store.dispatch(
        fromCompare.selectCalculation({ ...event[0], index: this.index })
      );
    } else {
      this.store.dispatch(fromDetail.selectCalculation(event[0]));
    }
  }

  public selectBomItem(item: BomItem): void {
    if (this.index !== undefined) {
      this.store.dispatch(
        fromCompare.selectBomItem({ item, index: this.index })
      );
    } else {
      this.store.dispatch(fromDetail.selectBomItem({ item }));
    }
  }

  private initializeWithCompareSelectors(): void {
    this.materialDesignation$ = this.store
      .select(fromCompare.getMaterialDesignation, this.index)
      .pipe(
        tap(
          (materialDesignation) =>
            (this.materialDesignation = materialDesignation)
        )
      );

    this.calculations$ = this.store.select(
      fromCompare.getCalculations,
      this.index
    );
    this.selectedCalculationNodeId$ = this.store.select(
      fromCompare.getSelectedCalculationNodeId,
      this.index
    );
    this.selectedCalculation$ = this.store
      .select(fromCompare.getSelectedCalculation, this.index)
      .pipe(
        tap(
          (selectedCalculation) =>
            (this.selectedCalculation = selectedCalculation)
        )
      );
    this.calculationsLoading$ = this.store.select(
      fromCompare.getCalculationsLoading,
      this.index
    );
    this.calculationsErrorMessage$ = this.store.select(
      fromCompare.getCalculationsError,
      this.index
    );

    this.bomItems$ = this.store.select(fromCompare.getBomItems, this.index);
    this.bomLoading$ = this.store.select(fromCompare.getBomLoading, this.index);
    this.bomErrorMessage$ = this.store.select(
      fromCompare.getBomError,
      this.index
    );
    this.childrenOfSelectedBomItem$ = this.store.select(
      fromCompare.getChildrenOfSelectedBomItem(this.index)
    );
  }

  private initializeWithDetailSelectors(): void {
    this.materialDesignation$ = this.store
      .select(fromDetail.getMaterialDesignation)
      .pipe(
        tap(
          (materialDesignation) =>
            (this.materialDesignation = materialDesignation)
        )
      );

    this.calculations$ = this.store.select(fromDetail.getCalculations);
    this.selectedCalculationNodeId$ = this.store.select(
      fromDetail.getSelectedCalculationNodeId
    );
    this.selectedCalculation$ = this.store
      .select(fromDetail.getSelectedCalculation)
      .pipe(
        tap(
          (selectedCalculation) =>
            (this.selectedCalculation = selectedCalculation)
        )
      );
    this.calculationsLoading$ = this.store.select(
      fromDetail.getCalculationsLoading
    );
    this.calculationsErrorMessage$ = this.store.select(
      fromDetail.getCalculationsError
    );

    this.bomItems$ = this.store.select(fromDetail.getBomItems);
    this.bomLoading$ = this.store.select(fromDetail.getBomLoading);
    this.bomErrorMessage$ = this.store.select(fromDetail.getBomError);
    this.childrenOfSelectedBomItem$ = this.store.select(
      fromDetail.getChildrenOfSelectedBomItem
    );
  }

  onGridReady(gridApi: GridApi): void {
    this.gridApi = gridApi;
  }

  public exportBomAsExcelFile(): void {
    this.gridApi.exportDataAsExcel({
      author: 'CDBA (Cost Database Analytics)',
      fileName: `CDBA-Bill-Of-Materials-${this.materialDesignation}.xlsx`,
      sheetName: this.materialDesignation,
      allColumns: true,
      prependContent: this.getBomMetadata(this.gridApi.getColumnDefs().length),
    });

    this.applicationInsights.logEvent('BoM Excel Export', {
      materialDesignation: this.materialDesignation,
    });
  }

  private getBomMetadata(numberOfColumns: number): ExcelCell[][] {
    const styleId = 'prependedMetadata';

    const emptyCell = {
      data: { value: ' ', type: 'String' },
      styleId,
    } as ExcelCell;

    const prependedMetadata = [[]] as ExcelCell[][];

    const emptyAndStyledExcelCells = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= numberOfColumns; i++) {
      emptyAndStyledExcelCells.push(emptyCell);
    }

    prependedMetadata[0] = [...emptyAndStyledExcelCells];
    prependedMetadata[1] = [...emptyAndStyledExcelCells];
    prependedMetadata[2] = [...emptyAndStyledExcelCells];

    prependedMetadata[0][1] = {
      data: {
        value: this.materialDesignation,
        type: 'String',
      },
      styleId,
    };

    prependedMetadata[0][2] = {
      data: {
        value: new MaterialNumberPipe().transform(
          this.selectedCalculation.materialNumber
        ),
        type: 'String',
      },
      styleId,
    };

    prependedMetadata[1][1] = {
      data: {
        value: `Cost Type: ${this.selectedCalculation.costType}`,
        type: 'String',
      },
      styleId,
    };

    prependedMetadata[1][2] = {
      data: {
        value: `Calculation Date: ${this.localeService.localizeDate(
          this.selectedCalculation.calculationDate
        )}`,
        type: 'String',
      },
      styleId,
    };

    return prependedMetadata;
  }
}
