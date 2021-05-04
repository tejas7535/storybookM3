import { Component, Input } from '@angular/core';

import { Quotation } from '../../shared/models';

@Component({
  selector: 'gq-header-content',
  templateUrl: './header-content.component.html',
})
export class HeaderContentComponent {
  @Input() quotation: Quotation;
}
