import { Location } from '@angular/common';
import { Component } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { Breadcrumb } from '@schaeffler/breadcrumbs';
@Component({
  selector: 'goldwind-legal',
  templateUrl: './legal.component.html',
})
export class LegalComponent {
  currentRoute: any = 'current Page';

  public breadcrumbs: Breadcrumb[] = [
    {
      label: translate('app.home'),
      url: '/',
    },
    {
      label: translate('app.legal'),
    },
    {
      label: translate('app.currentPage'),
    },
  ];
  constructor(private readonly location: Location) {}

  /**
   * Goes back in the browser history to the last page
   * @param e
   */
  back(e: PointerEvent | MouseEvent): void {
    e.preventDefault();
    this.location.back();
  }
}
