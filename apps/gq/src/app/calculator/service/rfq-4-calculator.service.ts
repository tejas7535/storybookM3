import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { CalculatorTab } from '../rfq-4-overview-view/models/calculator-tab.enum';
import { Rfq4OverviewTabCounts } from '../rfq-4-overview-view/store/rfq-4-overview.store';
@Injectable({
  providedIn: 'root',
})
export class Rfq4CalculatorService {
  loadCount(tabCounts: Rfq4OverviewTabCounts): Observable<{
    [CalculatorTab.OPEN]: number;
    [CalculatorTab.IN_PROGRESS]: number;
    [CalculatorTab.DONE]: number;
  }> {
    const index = this.getRandomEnumValueForCalculatorTab();
    tabCounts[index] = tabCounts[index] + 1;

    return of(tabCounts);
  }

  loadDataForTab(
    tabInput: string[],
    countDisplayed: number,
    countDatabase: number
  ): Observable<string[]> {
    if (countDisplayed === countDatabase) {
      return of(tabInput);
    }
    // add as many items as the countDatabase
    for (let i = countDisplayed; i < countDatabase; i = i + 1) {
      tabInput.push(`loaded Item${tabInput.length + 1}`);
    }
    // add one item to the tabInput

    return of([...tabInput]);
  }

  private getRandomEnumValueForCalculatorTab(): CalculatorTab {
    const values = Object.values(CalculatorTab);
    const randomIndex = Math.floor(Math.random() * values.length);

    return values[randomIndex];
  }
}
