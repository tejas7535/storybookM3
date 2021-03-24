import { Component, Input, OnInit } from '@angular/core';

import { Breadcrumb } from './breadcrumb.model';

@Component({
  selector: 'mac-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  @Input() breadcrumbs?: Breadcrumb[];

  constructor() {}

  ngOnInit(): void {}
}
