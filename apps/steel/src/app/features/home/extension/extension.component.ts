import { Component, Input } from '@angular/core';

import { SnackBarService } from '@schaeffler/shared/ui-components';

import { Extension } from './extension.model';

@Component({
  selector: 'schaeffler-steel-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.scss']
})
export class ExtensionComponent {
  @Input() extension: Extension = {
    name: 'Default Extension',
    description: 'This should not show up in the real application',
    WIP: false
  };

  constructor(private readonly snackBarService: SnackBarService) {}

  showSuccessToast(): void {
    this.snackBarService.showSuccessMessage('Downloaded');
  }
}
