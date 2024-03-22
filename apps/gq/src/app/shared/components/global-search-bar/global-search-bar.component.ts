import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

import { GlobalSearchAdvancedModalComponent } from './global-search-advanced-modal/global-search-advanced-modal.component';
import { GlobalSearchModalComponent } from './global-search-modal/global-search-modal.component';
@Component({
  selector: 'gq-global-search-bar',
  templateUrl: './global-search-bar.component.html',
  styleUrls: ['./global-search-bar.component.scss'],
})
export class GlobalSearchBarComponent {
  private readonly matDialog = inject(MatDialog);
  private readonly featureToggleService = inject(FeatureToggleConfigService);

  extendedSearchBar = this.featureToggleService.isEnabled('extendedSearchbar');

  openGlobalSearchModal() {
    if (this.extendedSearchBar) {
      this.matDialog.open(GlobalSearchAdvancedModalComponent, {
        panelClass: 'global-search-advanced-modal',
        width: '1100px',
        height: '500px',
      });
    } else {
      this.matDialog.open(GlobalSearchModalComponent, {
        panelClass: 'global-search-modal',
        width: '880px',
        position: {
          top: '20vh',
        },
      });
    }
  }
}
