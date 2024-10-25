import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HtmlTooltipComponent } from '@mac/shared/components/html-tooltip/html-tooltip.component';

import { MsdDialogService } from '../../../services';
import { MaterialEmissionClassificationColorPipe } from '../../pipes';

export enum ClassificationClass {
  GREY,
  LIGHT_GREEN,
  MEDIUM_GREEN,
  GREEN,
}

@Component({
  selector: 'mac-material-emission-classification',
  templateUrl: './material-emission-classification.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    MaterialEmissionClassificationColorPipe,
    HtmlTooltipComponent,
    // angular material
    MatIconModule,
    // cdk
    OverlayModule,
    // libs
    SharedTranslocoModule,
  ],
})
export class MaterialEmissionClassificationComponent implements OnInit {
  /**
   * Emissions per ton
   */
  @Input() value: number;
  @Input() displayValue?: number;
  @Input() transparent?: boolean;

  showTooltip: boolean;
  classificationClass: ClassificationClass;

  constructor(private readonly dialogService: MsdDialogService) {}

  ngOnInit(): void {
    this.showTooltip = this.shouldShowTooltip();

    if (this.showTooltip) {
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

  private shouldShowTooltip(): boolean {
    return !this.transparent && this.value !== undefined && this.value !== null;
  }
}
