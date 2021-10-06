import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '../../models';
import { Plant } from '../../models/quotation-detail';
import { MaterialAlternativeCost } from '../../models/quotation-detail/material-alternative-cost.model';

@Pipe({
  name: 'plantDisplay',
})
export class PlantDisplayPipe implements PipeTransform {
  transform(plant: Plant | MaterialAlternativeCost): string {
    if (plant) {
      return `${plant.plantNumber} | ${plant.city}, ${plant.country}`;
    }

    return Keyboard.DASH;
  }
}
