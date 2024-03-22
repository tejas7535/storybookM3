import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-no-data',
  templateUrl: './no-data.component.html',
})
export class NoDataComponent {
  @Input() title: string;
  @Input() subTitle: string;
}
