import { Injectable } from '@angular/core';

import { CostShareCategory } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CostShareService {
  public getCostShareCategory(costShare: number): CostShareCategory {
    switch (true) {
      case costShare > 0.5:
        return 'highest';
      case costShare > 0.3 && costShare <= 0.5:
        return 'high';
      case costShare > 0.2 && costShare <= 0.3:
        return 'medium';
      case costShare > 0.1 && costShare <= 0.2:
        return 'low';
      case costShare >= 0 && costShare <= 0.1:
        return 'lowest';
      case costShare < 0:
        return 'negative';
      default:
        return 'default';
    }
  }
}
