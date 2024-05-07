import { Component, inject } from '@angular/core';

import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'gq-reference-material-group-cell',
  templateUrl: './reference-material-group-cell.component.html',
})
export class ReferenceMaterialGroupCellComponent {
  value: string;
  params: ICellRendererParams;
  comparisonScreenEnabled: boolean;

  private readonly featureToggleService = inject(FeatureToggleConfigService);

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.value = params.value;
    this.comparisonScreenEnabled = this.featureToggleService.isEnabled(
      'fPricingComparisonScreen'
    );
  }

  clickMaterial(event: MouseEvent): void {
    event.preventDefault();
    this.params.context.componentParent.comparableMaterialClicked(this.value);
  }
}
