import { Pipe, PipeTransform } from '@angular/core';

import { Plant } from '../../../core/store/models';

@Pipe({
  name: 'plantDisplay',
})
export class PlantDisplayPipe implements PipeTransform {
  transform(plant: Plant): string {
    if (plant) {
      return `${plant.plantNumber} | ${plant.city}, ${plant.country}`;
    }

    return '-';
  }
}
