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

  readonly WHITE = '#FFFFFF';
  readonly BLACK = '#000000DE';

  readonly config = {
    [ClassificationClass.GREY]: {
      backgroundColor: '#E4E4E4',
      textColor: this.BLACK,
    },
    [ClassificationClass.LIGHT_GREEN]: {
      backgroundColor: '#ABC7BF',
      textColor: this.BLACK,
    },
    [ClassificationClass.MEDIUM_GREEN]: {
      backgroundColor: '#537C71',
      textColor: this.WHITE,
    },
    [ClassificationClass.GREEN]: {
      backgroundColor: '#006E5D',
      textColor: this.WHITE,
    },
  };

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
