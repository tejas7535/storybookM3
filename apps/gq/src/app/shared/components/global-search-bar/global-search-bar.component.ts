import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GlobalSearchModalComponent } from './global-search-modal/global-search-modal.component';

@Component({
  selector: 'gq-global-search-bar',
  templateUrl: './global-search-bar.component.html',
  styleUrls: ['./global-search-bar.component.scss'],
})
export class GlobalSearchBarComponent {
  constructor(private readonly matDialog: MatDialog) {}

  openGlobalSearchModal() {
    this.matDialog.open(GlobalSearchModalComponent, {
      panelClass: 'global-search-modal',
      width: '880px',
      position: {
        top: '20vh',
      },
    });
  }
}
