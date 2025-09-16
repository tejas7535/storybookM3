import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { debounceTime } from 'rxjs';

import { Store } from '@ngrx/store';

import { fetchBearinxVersions, getCalculation } from '../../actions';
import {
  getReportUrls,
  getVersions,
} from '../../selectors/calculation-result/calculation-result.selector';

@Injectable({
  providedIn: 'root',
})
export class CalculationResultFacade {
  private readonly store = inject(Store);

  public readonly reportUrls = toSignal(
    this.store.select(getReportUrls).pipe(debounceTime(3000))
  );

  public readonly bearinxVersions = this.store.selectSignal(getVersions);

  public fetchBearinxVersions(): void {
    this.store.dispatch(fetchBearinxVersions());
  }

  public getCalculation(): void {
    this.store.dispatch(getCalculation());
  }
}
