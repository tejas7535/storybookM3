import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(
    private readonly router: Router,
    private readonly snackBarService: SnackBarService
  ) {}

  gotoDetail(name: string): void {
    this.router.navigate(['/extension', name]);
  }

  showSuccessToast(): void {
    this.snackBarService.showSuccessMessage('Downloaded');
  }
}
