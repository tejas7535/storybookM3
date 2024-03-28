import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MsdDialogService } from '../../services';

@Component({
  imports: [SharedTranslocoModule],
  selector: 'mac-maturity-info',
  templateUrl: './maturity-info.component.html',
  standalone: true,
})
export class MaturityInfoComponent {
  @ViewChild('bottomTextTemplate') bottomTextTemplate: TemplateRef<HTMLElement>;

  constructor(private readonly dialogService: MsdDialogService) {}

  @HostListener('click')
  handleClick(): void {
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
