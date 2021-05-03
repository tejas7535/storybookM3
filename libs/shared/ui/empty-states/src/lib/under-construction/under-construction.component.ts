import { Component, Input } from '@angular/core';
import { translate } from '@ngneat/transloco';

@Component({
  selector: 'schaeffler-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.scss'],
})
export class UnderConstructionComponent {
  @Input() title: string = translate('underConstruction');
  @Input() message: string = translate('underConstructionMessage');
}
