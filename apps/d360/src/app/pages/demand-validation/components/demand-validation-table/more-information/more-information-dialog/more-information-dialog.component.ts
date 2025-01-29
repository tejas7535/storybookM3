import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialListEntry } from '../../../../../../feature/demand-validation/model';

@Component({
  selector: 'd360-more-information-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTabsModule,
    MatButtonModule,
    SharedTranslocoModule,
    DragDropModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './more-information-dialog.component.html',
  styleUrl: './more-information-dialog.component.scss',
})
export class MoreInformationDialogComponent {
  protected readonly material: MaterialListEntry = inject(MAT_DIALOG_DATA);

  protected title: Signal<string> = computed(() =>
    [this.material.materialNumber, this.material.materialDescription].join(
      ' | '
    )
  );

  protected prefix = 'validation_of_demand.more_information.dialog';

  protected materialBoxLeft: (keyof MaterialListEntry)[] = [
    'materialNumber',
    'materialDescription',
    'materialClassification',
    'productLine',
    'productLineName',
    'productCluster',
    'gpsd',
    'gpsdName',
    'successorCustomerMaterial',
    'successorCustomerMaterialDescription',
    'successorSchaefflerMaterial',
    'successorSchaefflerMaterialDescription',
    'materialNumberS4',
    'customerMaterialNumber',
    'demandCharacteristic',
  ];

  protected materialBoxRight: (keyof MaterialListEntry)[] = [
    'productionPlant',
    'productionPlantName',
    'productionSegment',
    'productionLine',
    'frozenZone',
    'currentRLTSchaeffler',
    'deliveryPlant',
    'planningPlant',
    'dispoGroup',
  ];

  protected customerBoxLeft: (keyof MaterialListEntry)[] = [
    'customerNumber',
    'customerName',
    'mainCustomerNumber',
    'mainCustomerName',
    'customerClassification',
    'region',
    'customerCountry',
    'salesArea',
    'sector',
    'sectorManagement',
    'salesOrg',
    'gkamNumber',
    'keyAccountName',
    'subKeyAccount',
    'subKeyAccountName',
  ];

  protected customerBoxRight: (keyof MaterialListEntry)[] = [
    'accountOwner',
    'internalSales',
    'demandPlanner',
    'gkam',
    'kam',
  ];

  protected items: Signal<any> = computed(() => [
    // material data
    {
      title: `${this.prefix}.tabs.material`,
      items: [
        {
          title: `${this.prefix}.boxes.generalMaterialInformation`,
          items: this.materialBoxLeft.map(this.map.bind(this)),
        },
        {
          title: `${this.prefix}.boxes.supplyChain`,
          items: this.materialBoxRight.map(this.map.bind(this)),
        },
      ],
    },

    // customer data
    {
      title: `${this.prefix}.tabs.customer`,
      items: [
        {
          title: `${this.prefix}.boxes.generalCustomerInformation`,
          items: this.customerBoxLeft.map(this.map.bind(this)),
        },
        {
          title: `${this.prefix}.boxes.contact`,
          items: this.customerBoxRight.map(this.map.bind(this)),
        },
      ],
    },
  ]);

  protected map(key: keyof MaterialListEntry): { text: string; value: string } {
    let value = '';

    switch (key) {
      case 'currentRLTSchaeffler': {
        value = `${this.material[key] || '-'} (${this.material['transitTimeBetweenProdPlantAndDistributionPlant'] || '0'})`;

        break;
      }

      case 'demandCharacteristic': {
        value = this.material[key]
          ? translate(
              `${this.prefix}.demandCharacteristics.${this.material[key]}`
            )
          : '-';

        break;
      }

      case 'sectorManagement': {
        value = `${this.material[key] || '-'} - ${this.material['sectorManagementText'] || '-'}`;

        break;
      }

      default: {
        value = `${this.material[key] || '-'}`;

        break;
      }
    }

    return {
      text: `${this.prefix}.entries.${key}`,
      value,
    };
  }
}
