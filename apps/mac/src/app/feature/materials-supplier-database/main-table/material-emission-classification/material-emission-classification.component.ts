import { Component, Input, OnInit } from '@angular/core';

import { translate } from '@jsverse/transloco';

import { MsdDialogService } from '../../services';

export enum ClassificationClass {
  GREY,
  LIGHT_GREEN,
  MEDIUM_GREEN,
  GREEN,
}

@Component({
  selector: 'mac-material-emission-classification',
  templateUrl: './material-emission-classification.component.html',
})
export class MaterialEmissionClassificationComponent implements OnInit {
  /**
   * Emissions per ton
   */
  @Input() value: number;
  @Input() displayValue?: number;
  @Input() transparent?: boolean;

  valueValid: boolean;
  classificationClass: ClassificationClass;

  constructor(private readonly dialogService: MsdDialogService) {}

  ngOnInit(): void {
    this.valueValid = this.isValueValid();

    if (this.valueValid) {
      this.classificationClass = this.determineClassificationClass();
    }
  }

  openMoreInformation() {
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

  private determineClassificationClass(): ClassificationClass {
    if (this.value <= 400) {
      return ClassificationClass.GREEN;
    } else if (this.value <= 1000) {
      return ClassificationClass.MEDIUM_GREEN;
    } else if (this.value <= 1750) {
      return ClassificationClass.LIGHT_GREEN;
    }

    return ClassificationClass.GREY;
  }

  private isValueValid(): boolean {
    return this.value !== undefined && this.value !== null;
  }
}
