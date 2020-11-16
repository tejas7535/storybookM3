import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Component } from '@angular/core';
import { QuotationDetail } from '../../../core/store/models';

@Component({
  selector: 'gq-total-row-count',
  templateUrl: './total-row-count.component.html',
  styleUrls: ['./total-row-count.component.scss'],
})
export class TotalRowCountComponent {
  totalNetValue = 0;
  totalRsp = 0;
  totalMargin = 0;
  selections: QuotationDetail[] = [];
  selectedNetValue = 0;
  selectedRsp = 0;
  selectedMargin = 0;

  private params: IStatusPanelParams;

  agInit(params: IStatusPanelParams): void {
    this.params = params;

    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }

  onGridReady(): void {
    let sumMargin = 0;
    let totalRowCount = 0;
    this.totalNetValue = 0;
    this.totalRsp = 0;

    this.params.api.forEachLeafNode((rowNode) => {
      this.totalNetValue += parseFloat(rowNode.data.netValue);
      this.totalRsp += parseFloat(rowNode.data.rsp);
      sumMargin += parseFloat(rowNode.data.margin);
      totalRowCount += 1;
    });

    this.totalMargin = sumMargin / totalRowCount;
  }

  onSelectionChange(): void {
    let sumMargin = 0;
    let totalRowCount = 0;
    this.selectedNetValue = 0;
    this.selectedRsp = 0;

    this.selections = this.params.api.getSelectedRows();
    this.selections.forEach((value) => {
      this.selectedNetValue += parseFloat(value.netValue);
      this.selectedRsp += parseFloat(value.rsp);
      sumMargin += parseFloat(value.margin);
      totalRowCount += 1;
    });

    this.selectedMargin = sumMargin / totalRowCount;
  }
}
