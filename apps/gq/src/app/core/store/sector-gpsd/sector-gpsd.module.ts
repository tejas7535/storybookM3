import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SectorGpsdEffects } from './sector-gpsd.effects';
import { SectorGpsdFacade } from './sector-gpsd.facade';
import { sectorGpsdFeature } from './sector-gpsd.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(sectorGpsdFeature),
    EffectsModule.forFeature([SectorGpsdEffects]),
  ],
  providers: [SectorGpsdFacade],
})
export class SectorGpsdModule {}
