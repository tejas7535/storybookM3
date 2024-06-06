import { Pipe, PipeTransform } from '@angular/core';

import {
  BG_GREEN,
  BG_GREY,
  BG_LIGHT_GREEN,
  BG_MEDIUM_GREEN,
  BLACK,
  WHITE,
} from '@mac/feature/materials-supplier-database/constants';

import { ClassificationClass } from '../../components/material-emission-classification/material-emission-classification.component';

@Pipe({
  name: 'materialEmissionClassificationColor',
  standalone: true,
})
export class MaterialEmissionClassificationColorPipe implements PipeTransform {
  public transform(classificationClass: ClassificationClass): string {
    switch (classificationClass) {
      case ClassificationClass.GREY: {
        return `bg-[${BG_GREY}] text-[${BLACK}]`;
      }
      case ClassificationClass.LIGHT_GREEN: {
        return `bg-[${BG_LIGHT_GREEN}] text-[${BLACK}]`;
      }
      case ClassificationClass.MEDIUM_GREEN: {
        return `bg-[${BG_MEDIUM_GREEN}] text-[${WHITE}]`;
      }
      case ClassificationClass.GREEN: {
        return `bg-[${BG_GREEN}] text-[${WHITE}]`;
      }
      default: {
        return 'bg-transparent';
      }
    }
  }
}
