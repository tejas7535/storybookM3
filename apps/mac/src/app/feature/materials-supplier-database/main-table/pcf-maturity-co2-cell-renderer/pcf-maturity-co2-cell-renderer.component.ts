import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { CATEGORY, EMISSION_FACTOR_KG } from '../../constants';

@Component({
  selector: 'mac-pcf-maturity-co2-cell-renderer',
  templateUrl: './pcf-maturity-co2-cell-renderer.component.html',
})
export class PcfMaturityCo2CellRendererComponent
  implements ICellRendererAngularComp
{
  params: ICellRendererParams;
  hovered = false;
  showMaterialEmissionClassification = false;

  // The material emission classification will be displayed only for these categories.
  private readonly categoriesForMaterialEmissionClassification = [
    'M013',
    'M018',
    'M412',
    'M422',
  ];

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.showMaterialEmissionClassification =
      this.shouldShowMaterialEmissionClassification();
  }

  refresh(): boolean {
    return false;
  }

  hasValue(): boolean {
    return !!(this.params?.value === 0 || this.params?.value);
  }

  getMaturity() {
    return this.params.data['maturity'];
  }

  private shouldShowMaterialEmissionClassification(): boolean {
    return (
      this.params.column.getColId() === EMISSION_FACTOR_KG &&
      this.categoriesForMaterialEmissionClassification.some(
        (category: string) =>
          category.toLowerCase() === this.params.data[CATEGORY]?.toLowerCase()
      )
    );
  }
}
