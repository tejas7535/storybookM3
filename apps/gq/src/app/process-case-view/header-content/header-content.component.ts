import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { EditCaseModalComponent } from '@gq/shared/components/modal/edit-case-modal/edit-case-modal.component';
import { EditCaseModalData } from '@gq/shared/components/modal/edit-case-modal/edit-case-modal-data.model';
import {
  PurchaseOrderType,
  Quotation,
  QuotationStatus,
  SAP_SYNC_STATUS,
} from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import { OfferType } from '@gq/shared/models/offer-type.interface';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { TranslocoService } from '@jsverse/transloco';
@Component({
  selector: 'gq-header-content',
  styleUrls: ['./header-content.component.scss'],
  templateUrl: './header-content.component.html',
  standalone: false,
})
export class HeaderContentComponent {
  @Input() set quotation(value: Quotation) {
    if (value) {
      if (value.caseName) {
        this.caseName = value.caseName;
      }

      this.currency = value.currency;
      this.showEditIcon =
        value.status === QuotationStatus.ACTIVE &&
        value.sapSyncStatus !== SAP_SYNC_STATUS.SYNC_PENDING;

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
      this.customerInquiryDate = value.sapCustomerInquiryDate ?? undefined;
      this.bindingPeriodValidityEndDate = value.validTo ?? undefined;
      this.enableSapFieldEditing = value.status === QuotationStatus.ACTIVE;
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
        this.isSapCase = true;
      }

      this.purchaseOrderType = value.purchaseOrderType;
      this.partnerRoleType = value.partnerRole;
      this.offerType = value.offerType;

      this.customer = value.customer;
      this.caseCreationDate = value.gqCreated;
    }
  }
  @Output() updateQuotation = new EventEmitter<UpdateQuotationRequest>();

  gqHeader$: Observable<string>;
  sapHeader$: Observable<string>;
  editCaseNameMode = false;
  caseName: string;
  saveCaseNameEnabled = false;
  currency: string;
  enableSapFieldEditing = false;
  quotationToDate: string;
  requestedDeliveryDate: string;
  customerPurchaseOrderDate: string;
  customerInquiryDate: string;
  bindingPeriodValidityEndDate: string;
  showEditIcon: boolean;
  shipToParty: Customer;
  purchaseOrderType: PurchaseOrderType;
  partnerRoleType: SectorGpsd;
  offerType: OfferType;
  customer: Customer;
  quotationStatus = QuotationStatus;
  isSapCase = false;
  caseCreationDate: string;

  private readonly translocoService: TranslocoService =
    inject(TranslocoService);
  private readonly matDialog: MatDialog = inject(MatDialog);
  private readonly transformationService: TransformationService = inject(
    TransformationService
  );
  openCaseEditingModal(): void {
    this.matDialog
      .open(EditCaseModalComponent, {
        width: '660px',
        position: {
          top: '50px',
        },
        panelClass: 'edit-case-modal',
        data: {
          caseName: this.caseName,
          currency: this.currency,
          enableSapFieldEditing: this.enableSapFieldEditing,
          quotationToDate: this.quotationToDate,
          requestedDeliveryDate: this.requestedDeliveryDate,
          customerPurchaseOrderDate: this.customerPurchaseOrderDate,
          customerInquiryDate: this.customerInquiryDate,
          bindingPeriodValidityEndDate: this.bindingPeriodValidityEndDate,
          shipToParty: {
            id: this.shipToParty?.identifier?.customerId,
            value: this.shipToParty?.name,
            value2: this.shipToParty?.country,
          },
          shipToPartySalesOrg: this.shipToParty?.identifier?.salesOrg,
          caseCustomer: this.customer,
          purchaseOrderType: this.purchaseOrderType,
          partnerRoleType: this.partnerRoleType,
          offerType: this.offerType,
          disabled: !this.showEditIcon,
          isSapCase: this.isSapCase,
          caseCreationDate: this.caseCreationDate,
        } as EditCaseModalData,
      })
      .afterClosed()
      .subscribe((result?: UpdateQuotationRequest) => {
        if (result) {
          this.updateQuotation.emit(result);
        }
      });
  }
}
