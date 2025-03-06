import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BrowserDetectionService } from '@cdba/shared/services';

import { BrowserSupportDialogComponent } from '../browser-support-dialog/browser-support-dialog.component';

@Component({
  selector: 'cdba-browser-support-detector',
  template: ``,
  standalone: false,
})
export class BrowserSupportDetectorComponent implements OnInit {
  public constructor(
    private readonly browserDetectionService: BrowserDetectionService,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    if (this.browserDetectionService.isUnsupportedBrowser()) {
      this.dialog.open(BrowserSupportDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
        maxWidth: 520,
        autoFocus: false,
      });
    }
  }
}
