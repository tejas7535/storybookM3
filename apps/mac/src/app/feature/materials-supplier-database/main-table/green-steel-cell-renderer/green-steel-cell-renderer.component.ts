import { Component } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { EditCellRendererComponent } from '../edit-cell-renderer/edit-cell-renderer.component';

@Component({
  selector: 'mac-green-steel-cell-renderer',
  templateUrl: './green-steel-cell-renderer.component.html',
})
export class GreenSteelCellRendererComponent extends EditCellRendererComponent {
  public getRating(): number {
    let result = 0;
    const co2Value: number = this.params?.value;
    if (co2Value <= 400) {
      result = 3;
    } else if (co2Value <= 1000) {
      result = 2;
    } else if (co2Value <= 1750) {
      result = 1;
    }

    return result;
  }

  public isValid(): boolean {
    const co2Value = this.params?.value;

    return !(!co2Value && co2Value !== 0);
  }

  public openMoreInformation() {
    this.dialogService.openInfoDialog(
      translate(
        'materialsSupplierDatabase.mainTable.tooltip.greensteel.moreInformationTitle'
      ),
      undefined,
      translate(
        'materialsSupplierDatabase.mainTable.tooltip.greensteel.moreInformationImg'
      ),
      translate(
        'materialsSupplierDatabase.mainTable.tooltip.greensteel.moreInformationImgCaption'
      ),
      undefined,
      translate(
        'materialsSupplierDatabase.mainTable.tooltip.greensteel.moreInformationContact'
      ),
      translate(
        'materialsSupplierDatabase.mainTable.tooltip.greensteel.moreInformationContactLink'
      )
    );
  }
}
