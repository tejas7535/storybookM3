import { inject, Injectable } from '@angular/core';

import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { Store } from '@ngrx/store';

import { selectSectorGpsd } from '../actions/create-case/create-case.actions';
import { SectorGpsdActions } from './sector-gpsd.actions';
import { sectorGpsdFeature } from './sector-gpsd.reducer';

@Injectable({
  providedIn: 'root',
})
export class SectorGpsdFacade {
  private readonly store = inject(Store);

  sectorGpsds$ = this.store.select(sectorGpsdFeature.selectSectorGpsds);
  sectorGpsdLoading$ = this.store.select(
    sectorGpsdFeature.selectSectorGpsdLoading
  );

  selectedSectorGpsd$ = this.store.select(
    sectorGpsdFeature.getSelectedSectorGpsd
  );

  loadSectorGpsdByCustomerAndSalesOrg(
    customerId: string,
    salesOrg: string
  ): void {
    this.store.dispatch(
      SectorGpsdActions.getAllSectorGpsds({ customerId, salesOrg })
    );
  }
  selectSectorGpsdForCaseCreation(sectorGpsd: SectorGpsd): void {
    this.store.dispatch(selectSectorGpsd({ sectorGpsd }));
  }

  resetAllSectorGpsds(): void {
    this.store.dispatch(SectorGpsdActions.resetAllSectorGpsds());
  }
}
