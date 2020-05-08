import { Component, Input } from '@angular/core';

import { Icon } from '@schaeffler/icons';

import { Extension } from './extension.model';

@Component({
  selector: 'schaeffler-steel-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.scss'],
})
export class ExtensionComponent {
  @Input() extension: Extension = {
    name: 'Default Extension',
    description: 'This should not show up in the real application',
    WIP: false,
  };

  getMaterialIcon(icon: string): Icon {
    return new Icon(icon, true);
  }
}
