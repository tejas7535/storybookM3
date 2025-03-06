import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '../../models';
import { Plant } from '../../models/quotation-detail';
import { MaterialComparableCost } from '../../models/quotation-detail/material-comparable-cost.model';

@Pipe({
  name: 'plantDisplay',
  standalone: false,
})
export class PlantDisplayPipe implements PipeTransform {
  transform(plant: Plant | MaterialComparableCost): string {
    if (plant) {
      return `${plant.plantNumber} | ${plant.city}, ${plant.country}`;
    }

    return Keyboard.DASH;
  }
}
