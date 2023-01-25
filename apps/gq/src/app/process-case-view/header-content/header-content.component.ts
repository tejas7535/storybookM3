import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { EditCaseModalComponent } from '../../shared/components/modal/edit-case-modal/edit-case-modal.component';
import { Quotation, QuotationStatus } from '../../shared/models';
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
  public enableEditDates = false;
  public quotationToDate: string;
  public requestedDeliveryDate: string;
  public customerPurchaseOrderDate: string;
  public bindingPeriodValidityEndDate: string;
  public showEditIcon: boolean;

  public quotationStatus = QuotationStatus;

  @Output() updateQuotation = new EventEmitter<UpdateQuotationRequest>();

  @Input() set quotation(value: Quotation) {
    if (value) {
      if (value.caseName) {
        this.caseName = value.caseName;
      }

      this.currency = value.currency;
      this.showEditIcon = value.status === QuotationStatus.ACTIVE;

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

      this.quotationToDate = value.sapQuotationToDate ?? undefined;
      this.requestedDeliveryDate = value.requestedDelDate ?? undefined;
      this.customerPurchaseOrderDate =
        value.sapCustomerPurchaseOrderDate ?? undefined;
      this.bindingPeriodValidityEndDate = value.validTo ?? undefined;
      this.enableEditDates = true;

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

        this.enableEditDates = false;
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
          enableEditDates: this.enableEditDates,
          quotationToDate: this.quotationToDate,
          requestedDeliveryDate: this.requestedDeliveryDate,
          customerPurchaseOrderDate: this.customerPurchaseOrderDate,
          bindingPeriodValidityEndDate: this.bindingPeriodValidityEndDate,
        },
      })
      .afterClosed()
      .subscribe((result?: UpdateQuotationRequest) => {
        if (
          result &&
          (result.caseName !== this.caseName ||
            result.currency !== this.currency ||
            result.quotationToDate !== this.quotationToDate ||
            result.requestedDelDate !== this.requestedDeliveryDate ||
            result.customerPurchaseOrderDate !==
              this.customerPurchaseOrderDate ||
            result.validTo !== this.bindingPeriodValidityEndDate)
        ) {
          this.updateQuotation.emit({
            caseName: result.caseName,
            currency: result.currency,
            quotationToDate: result.quotationToDate,
            requestedDelDate: result.requestedDelDate,
            customerPurchaseOrderDate: result.customerPurchaseOrderDate,
            validTo: result.validTo,
          });
        }
      });
  }
}
