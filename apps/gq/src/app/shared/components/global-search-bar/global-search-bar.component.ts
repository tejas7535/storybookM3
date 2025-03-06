import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GlobalSearchAdvancedModalComponent } from './global-search-advanced-modal/global-search-advanced-modal.component';
@Component({
  selector: 'gq-global-search-bar',
  templateUrl: './global-search-bar.component.html',
  styleUrls: ['./global-search-bar.component.scss'],
  standalone: false,
})
export class GlobalSearchBarComponent {
  private readonly matDialog = inject(MatDialog);

  openGlobalSearchModal() {
    this.matDialog.open(GlobalSearchAdvancedModalComponent, {
      panelClass: 'global-search-advanced-modal',
      width: '1200px',
    });
  }
}
