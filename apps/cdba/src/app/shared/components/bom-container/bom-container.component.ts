import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';
import { GridReadyEvent } from 'ag-grid-community/dist/lib/events';
import { ExcelCell, ExcelRow, GridApi } from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import * as fromCompare from '@cdba/compare/store';
import * as fromDetail from '@cdba/core/store';
import { UnitOfMeasure } from '@cdba/shared/models/unit-of-measure.model';
import { MaterialNumberPipe } from '@cdba/shared/pipes';

import {
  BomItem,
  Calculation,
  CostComponentSplit,
  RawMaterialAnalysis,
} from '../../models';

@Component({
  selector: 'cdba-bom-container',
  templateUrl: './bom-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./bom-container.component.scss'],
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

  // Cost Component Split Variables
  costComponentSplitLoading$: Observable<boolean>;
  costComponentSplitErrorMessage$: Observable<string>;
  costComponentSplitItems$: Observable<CostComponentSplit[]>;
  costComponentSplitSummary$: Observable<CostComponentSplit[]>;

  // RawMaterialAnalysis
  _rawMaterialAnalysis$: Observable<RawMaterialAnalysis[]>;
  rawMaterialAnalysisSummary$: Observable<RawMaterialAnalysis[]>;

  public selectedBomItem: BomItem;
  public showSidenavContent = false;

  private gridApi: GridApi;

  public constructor(
    private readonly store: Store,
    private readonly applicationInsights: ApplicationInsightsService,
    private readonly localeService: TranslocoLocaleService
  ) {}

  get rawMaterialAnalysis$(): Observable<RawMaterialAnalysis[]> {
    return this._rawMaterialAnalysis$;
  }

  set rawMaterialAnalysis$(
    rawMaterialAnalysis$: Observable<RawMaterialAnalysis[]>
  ) {
    this._rawMaterialAnalysis$ = rawMaterialAnalysis$.pipe(
      tap((analysis: RawMaterialAnalysis[]) => {
        const unrecognisedUOMMap = new Map<string, string>();
        analysis?.forEach((item: RawMaterialAnalysis) => {
          // Log only first occurence
          if (
            item.unitOfMeasure === UnitOfMeasure.UNRECOGNISED &&
            !unrecognisedUOMMap.has(item.unrecognisedUOM)
          ) {
            const traceMsg = `Unrecognised unit of measure ${item.unrecognisedUOM} in MaterialDesignation ${item.materialDesignation} MaterialNumber ${item.materialNumber} Calculation Type ${this.selectedCalculation.costType} Calculation Date ${this.selectedCalculation.calculationDate}`;
            this.applicationInsights.logTrace(traceMsg);
            unrecognisedUOMMap.set(item.unrecognisedUOM, traceMsg);
          }
        });
      })
    );
  }

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
    this.selectedBomItem = item;

    if (this.index !== undefined) {
      this.store.dispatch(
        fromCompare.selectBomItem({ item, index: this.index })
      );
    } else {
      this.store.dispatch(fromDetail.selectBomItem({ item }));
    }
  }

  onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
  }

  public expandAll(): void {
    this.gridApi.expandAll();
  }

  public collapseAll(): void {
    this.gridApi.collapseAll();
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
      fromCompare.getDirectChildrenOfSelectedBomItem(this.index)
    );

    this.costComponentSplitLoading$ = this.store.select(
      fromCompare.getCostComponentSplitLoading(this.index)
    );
    this.costComponentSplitErrorMessage$ = this.store.select(
      fromCompare.getCostComponentSplitError(this.index)
    );
    this.costComponentSplitItems$ = this.store.select(
      fromCompare.getCostComponentSplitItems(this.index)
    );
    this.costComponentSplitSummary$ = this.store.select(
      fromCompare.getCostComponentSplitSummary(this.index)
    );

    this.rawMaterialAnalysis$ = this.store.select(
      fromCompare.getRawMaterialAnalysisForSelectedBomItem(this.index)
    );

    this.rawMaterialAnalysisSummary$ = this.store.select(
      fromCompare.getRawMaterialAnalysisSummaryForSelectedBom(this.index)
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
      fromDetail.getDirectChildrenOfSelectedBomItem
    );

    this.costComponentSplitLoading$ = this.store.select(
      fromDetail.getCostComponentSplitLoading
    );
    this.costComponentSplitErrorMessage$ = this.store.select(
      fromDetail.getCostComponentSplitError
    );
    this.costComponentSplitItems$ = this.store.select(
      fromDetail.getCostComponentSplitItems
    );
    this.costComponentSplitSummary$ = this.store.select(
      fromDetail.getCostComponentSplitSummary
    );

    this.rawMaterialAnalysis$ = this.store.select(
      fromDetail.getRawMaterialAnalysisForSelectedBomItem
    );

    this.rawMaterialAnalysisSummary$ = this.store.select(
      fromDetail.getRawMaterialAnalysisSummaryForSelectedBom
    );
  }

  private getBomMetadata(numberOfColumns: number): ExcelRow[] {
    const styleId = 'prependedMetadata';

    const emptyCell = {
      data: { value: ' ', type: 'String' },
      styleId,
    } as ExcelCell;

    const prependedMetadata = [] as ExcelRow[];

    const emptyAndStyledExcelCells: ExcelCell[] = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= numberOfColumns; i++) {
      emptyAndStyledExcelCells.push(emptyCell);
    }

    prependedMetadata[0] = this.createEmptyRow(0, emptyAndStyledExcelCells);
    prependedMetadata[1] = this.createEmptyRow(1, emptyAndStyledExcelCells);
    prependedMetadata[2] = this.createEmptyRow(2, emptyAndStyledExcelCells);

    // Material Designation[0][1] and Material Number[0][2]
    prependedMetadata[0].cells[1] = {
      data: {
        value: this.materialDesignation,
        type: 'String',
      },
      styleId,
    };
    prependedMetadata[0].cells[2] = {
      data: {
        value: new MaterialNumberPipe().transform(
          this.selectedCalculation.materialNumber
        ),
        type: 'String',
      },
      styleId,
    };

    // Cost Type[1][1] and Calculation Date[1][2]
    prependedMetadata[1].cells[1] = {
      data: {
        value: `Cost Type: ${this.selectedCalculation.costType}`,
        type: 'String',
      },
      styleId,
    };
    prependedMetadata[1].cells[2] = {
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

  private createEmptyRow(index: number, cells: ExcelCell[]): ExcelRow {
    return {
      index,
      collapsed: false,
      hidden: false,
      height: 1,
      outlineLevel: 0,
      cells: [...cells],
    };
  }
}
