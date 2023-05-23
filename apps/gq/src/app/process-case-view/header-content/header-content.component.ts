import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Customer } from '@gq/shared/models/customer';
import { TranslocoService } from '@ngneat/transloco';

import { EditCaseModalComponent } from '../../shared/components/modal/edit-case-modal/edit-case-modal.component';
import { Quotation, QuotationStatus } from '../../shared/models';
import { TransformationService } from '../../shared/services/transformation/transformation.service';
import { UpdateQuotationRequest } from '../../shared/services/rest/quotation/models/update-quotation-request.model';
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
  public enableSapFieldEditing = false;
  public quotationToDate: string;
  public requestedDeliveryDate: string;
  public customerPurchaseOrderDate: string;
  public bindingPeriodValidityEndDate: string;
  public showEditIcon: boolean;
  public shipToParty: Customer;

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
          gqCreationDate: this.TransformationService.transformDate(
            value.gqCreated,
            true
          ),
          gqUpdatedName: value.gqLastUpdatedByUser.name,
          gqUpdatedDate: this.TransformationService.transformDate(
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
            sapCreationDate: this.TransformationService.transformDate(
              value.sapCreated,
              true
            ),
            sapUpdatedDate: this.TransformationService.transformDate(
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

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly matDialog: MatDialog,
    private readonly TransformationService: TransformationService
  ) {}

  public openCaseEditingModal(): void {
    this.matDialog
      .open(EditCaseModalComponent, {
        width: '480px',
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
