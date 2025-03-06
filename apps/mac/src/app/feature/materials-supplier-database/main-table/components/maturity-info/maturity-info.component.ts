import { CommonModule } from '@angular/common';
import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MsdDialogService } from '../../../services';

interface MaturityTable {
  headers: TableHeader[];
  maturities: Maturity[];
}

interface TableHeader {
  translationKeySuffix: string;
  isCentered?: boolean;
}

interface Maturity {
  score: number;
  isDisabled?: boolean;
}

@Component({
  selector: 'mac-maturity-info',
  templateUrl: './maturity-info.component.html',
  imports: [
    // default
    CommonModule,
    // libs
    SharedTranslocoModule,
  ],
})
export class MaturityInfoComponent {
  @ViewChild('bottomTextTemplate') bottomTextTemplate: TemplateRef<HTMLElement>;

  readonly maturityTable: MaturityTable = {
    headers: [
      {
        translationKeySuffix: 'dataSourceHeader',
      },
      { translationKeySuffix: 'maturityHeader' },
      { translationKeySuffix: 'scoreHeader', isCentered: true },
    ],
    maturities: [
      {
        score: 10,
      },
      {
        score: 9,
      },
      {
        score: 8,
      },
      {
        score: 7,
      },
      {
        score: 6,
      },
      {
        score: 5,
      },
      {
        score: 3,
        isDisabled: true,
      },
      {
        score: 2,
      },
      {
        score: 1,
        isDisabled: true,
      },
    ],
  };

  constructor(private readonly dialogService: MsdDialogService) {}

  @HostListener('click')
  handleClick(): void {
    this.dialogService.openInfoDialog(
      translate(
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationTitle'
      ),
      undefined,
      undefined,
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
