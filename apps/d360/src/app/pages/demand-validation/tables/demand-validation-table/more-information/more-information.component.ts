import { Component, computed, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { parseISO } from 'date-fns';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  MaterialListEntry,
  SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES,
  SupplyConceptsStochasticType,
} from '../../../../../feature/demand-validation/model';
import { MoreInformationDialogComponent } from './more-information-dialog/more-information-dialog.component';

@Component({
  selector: 'd360-more-information',
  standalone: true,
  imports: [SharedTranslocoModule, MatIcon, MatButtonModule],
  templateUrl: './more-information.component.html',
  styleUrl: './more-information.component.scss',
})
export class MoreInformationComponent {
  public selectedMaterial = input.required<MaterialListEntry>();
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly dialog: MatDialog = inject(MatDialog);

  protected data: { title: string; value: string }[] = [];

  public constructor() {
    effect(() => {
      this.data = [
        {
          title: 'validation_of_demand.more_information.material_and_text',
          value: `${this.selectedMaterial()?.materialNumber || '-'}<br>${this.selectedMaterial()?.materialDescription || '-'}`,
        },
        {
          title: 'validation_of_demand.more_information.classification',
          value: `${this.selectedMaterial()?.materialClassification || '-'}`,
        },
        {
          title: 'validation_of_demand.supply_concept.title',
          value: this.supplyConcept(),
        },
        {
          title: 'validation_of_demand.more_information.pfStatus.title',
          value: `${translate(
            `validation_of_demand.more_information.pfStatus.${
              this.selectedMaterial()?.portfolioStatus
            }`
          )}${this.selectedMaterial()?.portfolioStatusDate ? `<br>${this.formatDate()}` : ''}`,
        },
        {
          title: 'validation_of_demand.more_information.packaging_size',
          value: `${this.selectedMaterial()?.packagingSize || '-'}`,
        },
      ];
    });
  }

  protected supplyConcept = computed(() => {
    let supplyConcept = translate('validation_of_demand.supply_concept.ELSE');

    const fixHor = this.selectedMaterial()?.fixHor
      ? this.translocoLocaleService.localizeDate(
          parseISO(this.selectedMaterial()?.fixHor)
        )
      : '';
    const stochasticType = this.selectedMaterial()
      ?.stochasticType as SupplyConceptsStochasticType;

    // The logic is duplicated and must exist in frontend and backend
    if (SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES.includes(stochasticType)) {
      if (this.selectedMaterial()?.safetyStockCustomer) {
        supplyConcept = translate(
          `validation_of_demand.supply_concept.${stochasticType}.csss`,
          {
            fixHor,
            safetyStock: this.selectedMaterial()?.safetyStockCustomer,
          }
        );
      } else if (this.selectedMaterial()?.safetyStock) {
        supplyConcept = translate(
          `validation_of_demand.supply_concept.${stochasticType}.ss`,
          {
            fixHor,
            safetyStock: this.selectedMaterial()?.safetyStock,
          }
        );
      } else {
        supplyConcept = translate(
          `validation_of_demand.supply_concept.${stochasticType}.rootString`,
          { fixHor }
        );
      }
    }

    return supplyConcept;
  });

  protected formatDate(): string {
    return this.translocoLocaleService.localizeDate(
      parseISO(this.selectedMaterial()?.portfolioStatusDate)
    );
  }

  protected openDetails(): void {
    this.dialog.open(MoreInformationDialogComponent, {
      data: this.selectedMaterial(),
      width: '1000px',
      panelClass: 'resizable',
    });
  }
}
