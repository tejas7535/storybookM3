import { Component, Input } from '@angular/core';

import { translate } from '@jsverse/transloco';

@Component({
  selector: 'schaeffler-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.scss'],
  standalone: false,
})
export class UnderConstructionComponent {
  @Input() public title: string = translate('underConstruction');
  @Input() public message: string = translate('underConstructionMessage');
}
