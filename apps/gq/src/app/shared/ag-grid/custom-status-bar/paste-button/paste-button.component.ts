import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { InfoIconModule } from '@gq/shared/components/info-icon/info-icon.module';
import { PasteMaterialsService } from '@gq/shared/services/paste-materials/paste-materials.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { isCaseViewParams } from '../../models/is-case-view-params.model';

@Component({
  selector: 'gq-paste-button',
  templateUrl: './paste-button.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TranslocoModule,
    InfoIconModule,
    PushPipe,
  ],
})
export class PasteButtonComponent {
  private readonly pasteMaterialsService: PasteMaterialsService = inject(
    PasteMaterialsService
  );
  private readonly matSnackBar: MatSnackBar = inject(MatSnackBar);

  private readonly createCaseFacade: CreateCaseFacade =
    inject(CreateCaseFacade);
  isCaseView: boolean;
  isNewCaseCreationView: boolean;
  customerIdentifier$: Observable<string> =
    this.createCaseFacade.customerIdForCaseCreation$;

  agInit(params: isCaseViewParams): void {
    this.isCaseView = params.isCaseView;
    this.isNewCaseCreationView = params.isNewCaseCreationView;
  }

  pasteFromClipboard(): void {
    this.pasteMaterialsService.onPasteStart(
      this.isCaseView,
      this.isNewCaseCreationView
    );
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
          'https://worksite.sharepoint.com/sites/Bearings-Industrial-Solutions-Sales-Management-Marketing/_layouts/15/stream.aspx?id=%2Fsites%2FBearings-Industrial-Solutions-Sales-Management-Marketing%2FShared+Documents%2FDocuments_GlobalPricing%2FGuided+Quoting%2FCase+Management+and+Operations%2FEnhanced+Paste+from+Clipboard+Function.mp4',
          '_blank'
        )
        .focus();
    });
  }
}
