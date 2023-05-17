import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Quotation } from '@gq/shared/models';

import { ReleaseModalComponent } from './release-modal/release-modal.component';

@Component({
  selector: 'gq-release-button',
  templateUrl: './release-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseButtonComponent {
  @Input() public quotation: Quotation;

  constructor(private readonly dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(ReleaseModalComponent, {
      data: this.quotation,
      width: '634px',
      panelClass: 'release-modal',
    });
  }
}
