import { Component, Input } from '@angular/core';

import { PagedMeta } from '../home.model';

@Component({
  selector: 'mm-calculation-options',
  templateUrl: './calculation-options.component.html',
  styleUrls: ['./calculation-options.component.scss'],
})
export class CalculationOptionsComponent {
  @Input()
  public pageMeta: PagedMeta;
}
