import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, inject, Signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProductionPlantForRfq } from '@gq/calculator/rfq-4-detail-view/models/rfq-4-detail-view-data.interface';
import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { AutocompleteSelectionComponent } from '@gq/shared/components/autocomplete-selection/autocomplete-selection.component';
import { SelectableValue } from '@gq/shared/models/selectable-value.model';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'gq-prod-plant-input',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    AutocompleteSelectionComponent,
  ],
  templateUrl: './prod-plant-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProdPlantInputComponent),
      multi: true,
    },
  ],
})
export class ProdPlantInputComponent extends BaseInputComponent {
  private readonly store = inject(Rfq4DetailViewStore);
  private readonly productionPlants: Signal<ProductionPlantForRfq[]> =
    this.store.getProductionPlants;
  private readonly selectedProductionPlant: Signal<string> =
    this.store.getSelectedProdPlant;

  readonly productionPlantsLoading: Signal<boolean> =
    this.store.getProductionPlantsLoading;

  readonly productionPlantsOptions: Signal<SelectableValue[]> = computed(() =>
    this.productionPlants()?.map((prodPlant) => ({
      id: prodPlant.plantNumber,
      value: prodPlant.city,
      value2: prodPlant.country,
      defaultSelection:
        prodPlant.plantNumber === this.selectedProductionPlant(),
    }))
  );
}
