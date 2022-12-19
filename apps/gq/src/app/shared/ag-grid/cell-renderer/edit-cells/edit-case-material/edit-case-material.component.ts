import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ICellRendererParams } from 'ag-grid-community';

import { FeatureToggleConfigService } from '../../../../services/feature-toggle/feature-toggle-config.service';

@Component({
  selector: 'gq-edit-case-material',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './edit-case-material.component.html',
})
export class EditCaseMaterialComponent {
  public params: ICellRendererParams;
  public cellValue: string;
  public showEditMaterialButtonEnabled: boolean;

  constructor(
    private readonly featureToggleService: FeatureToggleConfigService
  ) {
    this.showEditMaterialButtonEnabled = this.featureToggleService.isEnabled(
      'showEditMaterialButton'
    );
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;

    this.cellValue = this.getValueToDisplay(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);

    return true;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ?? params.value;
  }

  onIconClick(): void {
    // TODO: Add opening modal
  }
}
