import { Component, computed, inject, input } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { parseISO } from 'date-fns';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  ForecastInfo,
  MaterialListEntry,
  SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES,
  SupplyConceptsStochasticType,
} from '../../../../../feature/demand-validation/model';

@Component({
  selector: 'd360-more-information',
  standalone: true,
  imports: [SharedTranslocoModule],
  templateUrl: './more-information.component.html',
  styleUrl: './more-information.component.scss',
})
export class MoreInformationComponent {
  public selectedMaterial = input.required<MaterialListEntry>();
  public forecastInfo = input.required<ForecastInfo | null>();
  private readonly translocoLocaleService = inject(TranslocoLocaleService);

  protected supplyConcept = computed(() => {
    let supplyConcept = translate('validation_of_demand.supply_concept.ELSE');

    const fixHor = this.selectedMaterial()?.fixHor
      ? this.translocoLocaleService.localizeDate(
          parseISO(this.selectedMaterial()?.fixHor)
        )
      : '';
    const stochasticType = this.selectedMaterial()
      ?.stochasticType as SupplyConceptsStochasticType;

    // When the supply chain localization is changed, also check ExportDemandValidationService::buildSupplyConceptString
    // The logic is duplicated and must exist in frontend and backend
    if (SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES.includes(stochasticType)) {
      if (this.selectedMaterial()?.zv98QtyDl) {
        supplyConcept = translate(
          `validation_of_demand.supply_concept.${stochasticType}.csss`,
          {
            fixHor,
            safetyStock: this.selectedMaterial()?.zv98QtyDl,
          }
        );
      } else if (this.selectedMaterial()?.eisbeDl) {
        supplyConcept = translate(
          `validation_of_demand.supply_concept.${stochasticType}.ss`,
          {
            fixHor,
            safetyStock: this.selectedMaterial()?.eisbeDl,
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
}
