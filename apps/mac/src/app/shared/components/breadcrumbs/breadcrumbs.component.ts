import { Component, Input } from '@angular/core';

import { Breadcrumb } from './breadcrumb.model';

@Component({
  selector: 'mac-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  standalone: false,
})
export class BreadcrumbsComponent {
  @Input() breadcrumbs?: Breadcrumb[];
}
