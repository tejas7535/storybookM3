import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-no-tabs-data',
  templateUrl: './no-tabs-data.component.html',
})
export class NoTabsDataComponent {
  @Input() title: string;
  @Input() subTitle: string;
}
