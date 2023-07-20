import { Component, TemplateRef, ViewChild } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { MsdDialogService } from '../../services';

@Component({
  selector: 'mac-pcf-maturity-co2-cell-renderer',
  templateUrl: './pcf-maturity-co2-cell-renderer.component.html',
})
export class PcfMaturityCo2CellRendererComponent
  implements ICellRendererAngularComp
{
  @ViewChild('bottomTextTemplate')
  bottomTextTemplate: TemplateRef<any>;

  public params: ICellRendererParams;
  public hovered = false;

  constructor(protected readonly dialogService: MsdDialogService) {}

  public agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  public refresh(): boolean {
    return false;
  }

  public hasValue(): boolean {
    return !!(this.params?.value === 0 || this.params?.value);
  }

  public getMaturity() {
    return this.params.data['maturity'];
  }

  public openMoreInformation() {
    this.dialogService.openInfoDialog(
      translate(
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationTitle'
      ),
      undefined,
      translate(
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationImg'
      ),
      undefined,
      undefined,
      translate(
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationContact'
      ),
      translate(
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationContactLink'
      ),
      this.bottomTextTemplate
    );
  }
}
