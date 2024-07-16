import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PlantMaterialDetail } from '@gq/shared/models';
import { Store } from '@ngrx/store';

import {
  getPlantMaterialDetails,
  getPlantMaterialDetailsLoading,
} from '../selectors/plant-material-details/plant-material-details.selectors';

@Injectable({
  providedIn: 'root',
})
export class PlantMaterialDetailsFacade {
  private readonly store: Store = inject(Store);

  plantMaterialDetailsLoading$: Observable<boolean> = this.store.select(
    getPlantMaterialDetailsLoading
  );

  plantMaterialDetails$: Observable<PlantMaterialDetail[]> = this.store.select(
    getPlantMaterialDetails
  );
}
