import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  AgGridEvent,
} from '@ag-grid-enterprise/all-modules';

import { ProductCostAnalysis } from '@cdba/shared/models/index';

import { TransposedRowData } from './portfolio-analysis-table.models';
import { PortfolioAnalysisTableService } from './portfolio-analysis-table.service';

@Component({
  selector: 'cdba-portfolio-analysis-table',
  templateUrl: './portfolio-analysis-table.component.html',
  styleUrls: ['./portfolio-analysis-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioAnalysisTableComponent implements OnInit {
  @Input() productCostAnalyses: ProductCostAnalysis[];

  public rowData: TransposedRowData[] = [];
  public columnDefs: ColDef[] = [];
  public modules: any[] = [ClientSideRowModelModule];

  private gridApi: GridApi;

  constructor(private readonly tableService: PortfolioAnalysisTableService) {}

  ngOnInit(): void {
    this.resetColumnDefs();

    if (this.productCostAnalyses && this.productCostAnalyses.length > 0) {
      this.setColumnDefs(this.productCostAnalyses);
      this.setRowData(this.productCostAnalyses);
    }
  }

  onTableChanged(agGridEvent: AgGridEvent): void {
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
        suppressMenu: true,
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
