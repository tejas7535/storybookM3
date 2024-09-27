import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PushPipe } from '@ngrx/component';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
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
    MatTooltipModule,
    MatIconModule,
    // cdk
    OverlayModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    PushPipe,
  ],
})
export class PcfMaturityCo2CellRendererComponent
  implements ICellRendererAngularComp
{
  public params: ICellRendererParams;
  public hovered = false;
  public showMaterialEmissionClassification = false;
  public hasValue = false;
  public maturity = 0;
  public isUploader = this.dataFacade.hasMatnrUploaderRole$;

  // The material emission classification will be displayed only for these categories.
  private readonly materialGroupsForMaterialEmissionClassification = [
    'M011',
    'M012',
    'M013',
    'M018',
    'M019',
  ];

  constructor(private readonly dataFacade: DataFacade) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.showMaterialEmissionClassification =
      this.shouldShowMaterialEmissionClassification();

    this.hasValue = !!(this.params.value === 0 || this.params.value);
    this.maturity = this.params.data['maturity'];
  }

  refresh(): boolean {
    return false;
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
