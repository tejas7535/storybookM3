import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { EditCaseModalComponent } from '../../shared/components/modal/edit-case-modal/edit-case-modal.component';
import { Quotation } from '../../shared/models';
import { HelperService } from '../../shared/services/helper-service/helper-service.service';
import { UpdateQuotationRequest } from '../../shared/services/rest-services/quotation-service/models/update-quotation-request.model';

@Component({
  selector: 'gq-header-content',
  styleUrls: ['./header-content.component.scss'],
  templateUrl: './header-content.component.html',
})
export class HeaderContentComponent {
  public gqHeader$: Observable<string>;
  public sapHeader$: Observable<string>;
  public editCaseNameMode = false;
  public caseName: string;
  public saveCaseNameEnabled = false;
  public currency: string;

  @Output() updateQuotation = new EventEmitter<UpdateQuotationRequest>();

  @Input() set quotation(value: Quotation) {
    if (value) {
      if (value.caseName) {
        this.caseName = value.caseName;
      }

      this.currency = value.currency;

      this.gqHeader$ = this.translocoService.selectTranslate(
        'header.gqHeader',
        {
          gqCreationName: value.gqCreatedByUser.name,
          gqCreationDate: this.helperService.transformDate(
            value.gqCreated,
            true
          ),
          gqUpdatedName: value.gqLastUpdatedByUser.name,
          gqUpdatedDate: this.helperService.transformDate(
            value.gqLastUpdated,
            true
          ),
        },
        'process-case-view'
      );

      if (value.sapId) {
        this.sapHeader$ = this.translocoService.selectTranslate(
          'header.sapHeader',
          {
            sapCreationName: value.sapCreatedByUser.name,
            sapCreationDate: this.helperService.transformDate(
              value.sapCreated,
              true
            ),
            sapUpdatedDate: this.helperService.transformDate(
              value.sapLastUpdated,
              true
            ),
          },
          'process-case-view'
        );
      }
    }
  }

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly matDialog: MatDialog,
    private readonly helperService: HelperService
  ) {}

  public openCaseEditingModal(): void {
    this.matDialog
      .open(EditCaseModalComponent, {
        width: '480px',
        data: {
          caseName: this.caseName,
          currency: this.currency,
        },
      })
      .afterClosed()
      .subscribe((result?: UpdateQuotationRequest) => {
        if (
          result &&
          (result.caseName !== this.caseName ||
            result.currency !== this.currency)
        ) {
          this.updateQuotation.emit({
            caseName: result.caseName,
            currency: result.currency,
          });
        }
      });
  }
}
