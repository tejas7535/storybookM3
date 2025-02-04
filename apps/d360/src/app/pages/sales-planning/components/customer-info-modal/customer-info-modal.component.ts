import { CommonModule } from '@angular/common';
import { Component, computed, inject, Injectable, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';

import { Subject } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomerInfo } from '../../../../feature/sales-planning/model';

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
  public changes = new Subject<void>();

  public firstPageLabel: string;
  public itemsPerPageLabel: string;
  public lastPageLabel: string;
  public nextPageLabel: string;
  public previousPageLabel: string;

  public getRangeLabel(page: number, pageSize: number, length: number): string {
    const amountPages = Math.ceil(length / pageSize);

    return `${page + 1} of ${amountPages}`;
  }
}

export interface CustomerInfoModalProps {
  customerNumber: string;
  customerName: string;
  customerInfo: CustomerInfo[];
}

type AttributeConfig = Record<string, string | string[]>;

@Component({
  selector: 'd360-customer-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatButton,
    MatCard,
    MatPaginatorModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  templateUrl: './customer-info-modal.component.html',
})
export class CustomerInfoModalComponent {
  private readonly dialogRef = inject(MatDialogRef);

  protected readonly data: CustomerInfoModalProps = inject(MAT_DIALOG_DATA);

  protected readonly Object = Object;
  protected readonly title = `${this.data.customerNumber} - ${this.data.customerName}`;

  protected readonly pageIndex = signal(0);
  protected readonly pageLength = computed(() => this.data.customerInfo.length);

  protected onClose() {
    this.dialogRef.close();
  }

  protected customerAttributesToDisplay: AttributeConfig = {
    globalCustomerNumber: 'globalCustomerNumber',
    region: 'region',
    salesOrg: ['salesOrg', 'salesDescription'],
    salesArea: 'salesArea',
    country: ['countryCode', 'countryDescription'],
    sector: ['sector', 'sectorDescription'],
    keyAccount: ['keyAccountNumber', 'keyAccountName'],
    subKeyAccount: ['subKeyAccountNumber', 'subKeyAccountName'],
    planningCurrency: 'planningCurrency',
  };

  protected ownerAttributesToDisplay = [
    'accountOwner',
    'internalSales',
    'demandPlanner',
    'gkam',
    'kam',
  ];

  public handlePageEvent(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
  }

  protected getOwnerAttribute(attribute: string, index: number): string {
    return (
      this.data.customerInfo[index][attribute as keyof CustomerInfo] || '-'
    );
  }

  protected getCustomerAttribute(attribute: string, index: number): string {
    const configEntry = this.customerAttributesToDisplay[attribute];
    if (!configEntry) {
      return '';
    }

    return typeof configEntry === 'string'
      ? this.data.customerInfo[index][attribute as keyof CustomerInfo] || '-'
      : configEntry
          .map(
            (attr) =>
              this.data.customerInfo[index][attr as keyof CustomerInfo] || ''
          )
          .join(' - ');
  }
}
