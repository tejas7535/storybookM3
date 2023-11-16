import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { EditCaseModalComponent } from '@gq/shared/components/modal/edit-case-modal/edit-case-modal.component';
import { Quotation, QuotationStatus } from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { TranslocoService } from '@ngneat/transloco';
@Component({
  selector: 'gq-header-content',
  styleUrls: ['./header-content.component.scss'],
  templateUrl: './header-content.component.html',
})
export class HeaderContentComponent {
  @Output() updateQuotation = new EventEmitter<UpdateQuotationRequest>();

  public gqHeader$: Observable<string>;
  public sapHeader$: Observable<string>;
  public editCaseNameMode = false;
  public caseName: string;
  public saveCaseNameEnabled = false;
  public currency: string;
  public enableSapFieldEditing = false;
  public quotationToDate: string;
  public requestedDeliveryDate: string;
  public customerPurchaseOrderDate: string;
  public bindingPeriodValidityEndDate: string;
  public showEditIcon: boolean;
  public shipToParty: Customer;

  public quotationStatus = QuotationStatus;

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly matDialog: MatDialog,
    private readonly transformationService: TransformationService
  ) {}

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
          gqCreationDate: this.transformationService.transformDate(
            value.gqCreated,
            true
          ),
          gqUpdatedName: value.gqLastUpdatedByUser.name,
          gqUpdatedDate: this.transformationService.transformDate(
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
      this.enableSapFieldEditing = true;
      this.shipToParty = value.shipToParty ?? undefined;

      if (value.sapId) {
        this.sapHeader$ = this.translocoService.selectTranslate(
          'header.sapHeader',
          {
            sapCreationName: value.sapCreatedByUser.name,
            sapCreationDate: this.transformationService.transformDate(
              value.sapCreated,
              true
            ),
            sapUpdatedDate: this.transformationService.transformDate(
              value.sapLastUpdated,
              true
            ),
          },
          'process-case-view'
        );

        this.enableSapFieldEditing = false;
      }
    }
  }

  public openCaseEditingModal(): void {
    this.matDialog
      .open(EditCaseModalComponent, {
        width: '550px',
        data: {
          caseName: this.caseName,
          currency: this.currency,
          enableSapFieldEditing: this.enableSapFieldEditing,
          quotationToDate: this.quotationToDate,
          requestedDeliveryDate: this.requestedDeliveryDate,
          customerPurchaseOrderDate: this.customerPurchaseOrderDate,
          bindingPeriodValidityEndDate: this.bindingPeriodValidityEndDate,
          shipToParty: {
            id: this.shipToParty?.identifier?.customerId,
            value: this.shipToParty?.name,
            value2: this.shipToParty?.country,
          },
          salesOrg: this.shipToParty?.identifier?.salesOrg,
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
            result.validTo !== this.bindingPeriodValidityEndDate ||
            result.shipToParty?.customerId !==
              this.shipToParty?.identifier?.customerId)
        ) {
          this.updateQuotation.emit({
            caseName: result.caseName,
            currency: result.currency,
            quotationToDate: result.quotationToDate,
            requestedDelDate: result.requestedDelDate,
            customerPurchaseOrderDate: result.customerPurchaseOrderDate,
            validTo: result.validTo,
            shipToParty: result.shipToParty?.customerId
              ? result.shipToParty
              : undefined,
          });
        }
      });
  }
}
