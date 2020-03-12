import { Component, Input, OnInit } from '@angular/core';

import { SnackBarService } from '@schaeffler/shared/ui-components';

@Component({
  selector: 'schaeffler-steel-extension-download',
  templateUrl: './extension-download.component.html'
})
export class ExtensionDownloadComponent implements OnInit {
  @Input() file = '';
  @Input() raised = false;
  @Input() type = 'link';
  downloadLink: string;

  constructor(private readonly snackBarService: SnackBarService) {}

  ngOnInit(): void {
    this.downloadLink = `/assets/manifests/${this.file}`;
  }

  showSuccessToast(): void {
    this.snackBarService.showSuccessMessage('Downloaded');
  }
}
