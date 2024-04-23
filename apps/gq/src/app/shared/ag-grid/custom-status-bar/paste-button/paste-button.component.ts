import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { InfoIconModule } from '@gq/shared/components/info-icon/info-icon.module';
import { PasteMaterialsService } from '@gq/shared/services/paste-materials/paste-materials.service';
import { translate, TranslocoModule } from '@jsverse/transloco';

import { isCaseViewParams } from '../../models/is-case-view-params.model';

@Component({
  selector: 'gq-paste-button',
  templateUrl: './paste-button.component.html',
  imports: [MatIconModule, MatButtonModule, TranslocoModule, InfoIconModule],
  standalone: true,
})
export class PasteButtonComponent {
  public isCaseView: boolean;

  constructor(
    private readonly pasteMaterialsService: PasteMaterialsService,
    private readonly matSnackBar: MatSnackBar
  ) {}

  agInit(params: isCaseViewParams): void {
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
          'https://worksite.sharepoint.com/:v:/s/OG_18600/ERS7mthtil9Hs6AIFsWkhJEBJdHG-Tau29oC-FoShjjl9g?e=XTRj8w',
          '_blank'
        )
        .focus();
    });
  }
}
