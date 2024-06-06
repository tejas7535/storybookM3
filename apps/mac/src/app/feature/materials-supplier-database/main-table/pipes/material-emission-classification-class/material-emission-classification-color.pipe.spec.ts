import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import {
  BG_GREEN,
  BG_GREY,
  BG_LIGHT_GREEN,
  BG_MEDIUM_GREEN,
  BLACK,
  WHITE,
} from '@mac/feature/materials-supplier-database/constants';

import { ClassificationClass } from '../../components/material-emission-classification/material-emission-classification.component';
import { MaterialEmissionClassificationColorPipe } from './material-emission-classification-color.pipe';

describe('MaterialEmissionClassificationColorPipe', () => {
  let spectator: SpectatorPipe<MaterialEmissionClassificationColorPipe>;
  const createPipe = createPipeFactory(MaterialEmissionClassificationColorPipe);

  it.each([
    [ClassificationClass.GREY, `bg-[${BG_GREY}] text-[${BLACK}]`],
    [ClassificationClass.LIGHT_GREEN, `bg-[${BG_LIGHT_GREEN}] text-[${BLACK}]`],
    [
      ClassificationClass.MEDIUM_GREEN,
      `bg-[${BG_MEDIUM_GREEN}] text-[${WHITE}]`,
    ],
    [ClassificationClass.GREEN, `bg-[${BG_GREEN}] text-[${WHITE}]`],
    [undefined, `bg-transparent`],
    ['anything', `bg-transparent`],
  ])('classification %s should return %s', (classificationClass, expected) => {
    spectator = createPipe(
      `{{ ${classificationClass} | materialEmissionClassificationColor }}`
    );
    expect(spectator.element).toHaveText(expected);
  });
});
