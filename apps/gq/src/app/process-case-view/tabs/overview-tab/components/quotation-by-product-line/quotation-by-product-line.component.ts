import { Component } from '@angular/core';

import { Observable, of } from 'rxjs';

import { BarChartData } from './models/bar-chart-data.model';

@Component({
  selector: 'gq-quotation-by-product-line',
  templateUrl: './quotation-by-product-line.component.html',
})
export class QuotationByProductLineComponent {
  public data$: Observable<BarChartData[]> = of(
    [
      { name: 'pl-1', value: 500, gpm: '50%', share: '10%' },
      { name: 'pl-2', value: 150, gpm: '40%', share: '20%' },
      { name: 'pl-3', value: 700, gpm: '30%', share: '30%' },
      { name: 'pl-4', value: 200, gpm: '20%', share: '12%' },
      { name: 'pl-5', value: 1500, gpm: '51%', share: '18%' },
      { name: 'pl-6', value: 2500, gpm: '52%', share: '24%' },
      { name: 'pl-7', value: 3500, gpm: '55%', share: '18%' },
      { name: 'pl-8', value: 500, gpm: '50%', share: '10%' },
      { name: 'pl-9', value: 150, gpm: '40%', share: '20%' },
      { name: 'pl-10', value: 700, gpm: '30%', share: '30%' },
      { name: 'pl-14', value: 200, gpm: '20%', share: '12%' },
      { name: 'pl-15', value: 1500, gpm: '51%', share: '18%' },
      { name: 'pl-16', value: 2500, gpm: '52%', share: '24%' },
      { name: 'pl-17', value: 3500, gpm: '55%', share: '18%' },
      { name: 'pl-18', value: 700, gpm: '30%', share: '30%' },
      { name: 'pl-19', value: 200, gpm: '20%', share: '12%' },
      { name: 'pl-20', value: 1500, gpm: '51%', share: '18%' },
      { name: 'pl-21', value: 2500, gpm: '52%', share: '24%' },
      { name: 'pl-21', value: 3500, gpm: '55%', share: '18%' },
    ].sort((a: BarChartData, b: BarChartData) => a.value - b.value)
  );
}
