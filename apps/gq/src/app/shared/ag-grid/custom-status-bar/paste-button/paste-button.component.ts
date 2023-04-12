import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { InfoIconModule } from '@gq/shared/components/info-icon/info-icon.module';
import { PasteMaterialsService } from '@gq/shared/services/paste-materials/paste-materials.service';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { PasteButtonParams } from './paste-button-params.model';

@Component({
  selector: 'gq-paste-button',
  templateUrl: './paste-button.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    TranslocoModule,
    CommonModule,
    InfoIconModule,
  ],
  standalone: true,
})
export class PasteButtonComponent {
  public isCaseView: boolean;

  constructor(
    private readonly pasteMaterialsService: PasteMaterialsService,
    private readonly matSnackBar: MatSnackBar
  ) {}

  agInit(params: PasteButtonParams): void {
    this.isCaseView = params.isCaseView;
  }

  pasteFromClipboard(): void {
    this.pasteMaterialsService.onPasteStart(this.isCaseView);
  }

  displaySnackBar(): void {
    const matSnackBarRef = this.matSnackBar.open(
      translate('shared.caseMaterial.addEntry.pasteSnackbar.message'),
      translate('shared.caseMaterial.addEntry.pasteSnackbar.action'),
      { duration: 5000 }
    );
    matSnackBarRef?.onAction().subscribe(() => {
      window
        .open(
          'https://worksite-my.sharepoint.com/:v:/g/personal/schmjan_schaeffler_com/Efn1Vc3JU9lNtI-PZoyVM1UBgUmnnXN1AsCir5lnqvT_fQ?e=rUsbeU',
          '_blank'
        )
        .focus();
    });
  }
}
