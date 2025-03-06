import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import {
  AgGridEvent,
  ColDef,
  GridApi,
  GridSizeChangedEvent,
  RowDataUpdatedEvent,
} from 'ag-grid-enterprise';

import { ProductCostAnalysis } from '@cdba/shared/models';

import { CustomHeaderComponent } from './custom-header-component/custom-header.component';
import { TransposedRowData } from './portfolio-analysis-table.models';
import { PortfolioAnalysisTableService } from './portfolio-analysis-table.service';

@Component({
  selector: 'cdba-portfolio-analysis-table',
  templateUrl: './portfolio-analysis-table.component.html',
  styleUrls: ['./portfolio-analysis-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PortfolioAnalysisTableComponent implements OnInit, OnChanges {
  @Input() productCostAnalyses: ProductCostAnalysis[];

  public rowData: TransposedRowData[] = [];
  public columnDefs: ColDef[] = [];

  private gridApi: GridApi;

  constructor(private readonly tableService: PortfolioAnalysisTableService) {}

  ngOnInit(): void {
    this.resetColumnDefs();

    if (this.productCostAnalyses && this.productCostAnalyses.length > 0) {
      this.setColumnDefs(this.productCostAnalyses);
      this.setRowData(this.productCostAnalyses);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.productCostAnalyses) {
      this.resetColumnDefs();
      this.setColumnDefs(this.productCostAnalyses);
      this.setRowData(this.productCostAnalyses);
    }
  }

  onTableChanged(
    agGridEvent: AgGridEvent<RowDataUpdatedEvent | GridSizeChangedEvent>
  ): void {
    this.gridApi = agGridEvent.api;
    this.gridApi.sizeColumnsToFit();
  }

  private resetColumnDefs(): void {
    this.columnDefs = [this.tableService.getLabelColumn()];
  }

  private setColumnDefs(productCostAnalyses: ProductCostAnalysis[]): void {
    this.resetColumnDefs();

    productCostAnalyses.forEach((productCostAnalysis) => {
      this.columnDefs.push({
        field: productCostAnalysis.id,
        headerName: productCostAnalysis.materialDesignation,
        headerTooltip: productCostAnalysis.materialDesignation,
        headerComponent: CustomHeaderComponent,
        headerComponentParams: {
          nodeId: productCostAnalysis.id,
        },
        suppressHeaderMenuButton: true,
        cellStyle: { textAlign: 'center' },
      });
    });
  }

  private setRowData(productCostAnalyses: ProductCostAnalysis[]): void {
    this.rowData = this.tableService.getDataFields().map((field) => {
      const fieldValues: any = {
        label: field.label,
      };

      productCostAnalyses.forEach((productCostAnalysis: any) => {
        fieldValues[productCostAnalysis.id] = this.tableService.formatValue(
          productCostAnalysis[field.fieldName],
          field.fieldName
        );
      });

      return fieldValues;
    });
  }
}
