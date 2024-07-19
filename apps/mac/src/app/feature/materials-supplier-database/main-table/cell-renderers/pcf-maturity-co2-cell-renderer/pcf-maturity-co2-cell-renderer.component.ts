import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HtmlTooltipComponent } from '@mac/shared/components/html-tooltip/html-tooltip.component';

import { EMISSION_FACTOR_KG, MATERIAL_GROUP } from '../../../constants';
import { MaterialEmissionClassificationComponent } from '../../components/material-emission-classification/material-emission-classification.component';
import { MaturityInfoComponent } from '../../components/maturity-info/maturity-info.component';

@Component({
  selector: 'mac-pcf-maturity-co2-cell-renderer',
  templateUrl: './pcf-maturity-co2-cell-renderer.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    MaterialEmissionClassificationComponent,
    HtmlTooltipComponent,
    MaturityInfoComponent,
    // angular material
    MatIconModule,
    // cdk
    OverlayModule,
    // libs
    SharedTranslocoModule,
  ],
})
export class PcfMaturityCo2CellRendererComponent
  implements ICellRendererAngularComp
{
  params: ICellRendererParams;
  hovered = false;
  showMaterialEmissionClassification = false;

  // The material emission classification will be displayed only for these categories.
  private readonly materialGroupsForMaterialEmissionClassification = [
    'M011',
    'M012',
    'M013',
    'M018',
    'M019',
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
      this.materialGroupsForMaterialEmissionClassification.some(
        (group: string) =>
          this.params.data[MATERIAL_GROUP]?.toUpperCase().startsWith(group)
      )
    );
  }
}
