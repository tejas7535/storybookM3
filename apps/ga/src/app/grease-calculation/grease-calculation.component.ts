import { Component } from '@angular/core';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'ga-grease-calculation',
  templateUrl: './grease-calculation.component.html',
})
export class GreaseCalculationComponent {
  public breadcrumbs: Breadcrumb[] = [
    {
      label: 'Landing Page',
      url: '/',
    },
    {
      label: 'Grease Calculator',
    },
  ];
}
