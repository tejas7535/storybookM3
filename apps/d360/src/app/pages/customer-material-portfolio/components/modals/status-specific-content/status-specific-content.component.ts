import { CommonModule } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  CMPData,
  PortfolioStatus,
} from '../../../../../feature/customer-material-portfolio/cmp-modal-types';
import { InactivateStatusSpecificContentComponent } from './inactivate-status-specific-content/inactivate-status-specific-content.component';
import { PhaseInStatusSpecificContentComponent } from './phase-in-status-specific-content/phase-in-status-specific-content.component';
import { PhaseOutStatusSpecificContentComponent } from './phase-out-status-specific-content/phase-out-status-specific-content.component';
import { SubstitutionStatusSpecificContentComponent } from './substitution-status-specific-content/substitution-status-specific-content.component';

export interface StatusSpecificContentProps {
  data: CMPData;
  showValidation: boolean;
  formGroup: FormGroup;
}

@Component({
  selector: 'app-status-specific-content',
  standalone: true,
  imports: [
    CommonModule,
    PhaseInStatusSpecificContentComponent,
    SharedTranslocoModule,
    PhaseOutStatusSpecificContentComponent,
    SubstitutionStatusSpecificContentComponent,
    InactivateStatusSpecificContentComponent,
  ],
  templateUrl: './status-specific-content.component.html',
  styleUrl: './status-specific-content.component.scss',
})
export class StatusSpecificContentComponent {
  props = input.required<StatusSpecificContentProps>();
  protected statusToUse: PortfolioStatus | 'NO';
  protected noStatusError = translate(
    'customer_material_portfolio.modal.error.no_status',
    {}
  );

  constructor() {
    effect(() => {
      this.statusToUse = this.props().data.portfolioStatus || 'NO';
    });
  }
}
