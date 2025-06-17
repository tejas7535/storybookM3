import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationParametersFacade } from '@ga/core/store';

@Component({
  selector: 'ga-selected-competitor-grease',
  templateUrl: './selected-competitor-grease.component.html',
  imports: [SharedTranslocoModule, MatCardModule],
})
export class SelectedCompetitorGreaseComponent {
  private readonly calculationParametersFacade = inject(
    CalculationParametersFacade
  );

  public selectedCompetitorGrease = toSignal(
    this.calculationParametersFacade.selectedCompetitorGrease$,
    { initialValue: undefined }
  );

  public competitorGreaseFullName = computed(() => {
    const grease = this.selectedCompetitorGrease();

    const company = grease?.company || '';
    const companyName = company === 'Others' ? '' : `${company} `;

    const name = grease?.name || '';

    return `${companyName}${name}`;
  });
}
