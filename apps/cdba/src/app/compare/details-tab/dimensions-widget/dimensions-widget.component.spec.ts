import { DimensionAndWeightDetails } from '@cdba/shared/models';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as compareEnJson from '../../../../assets/i18n/compare/en.json';
import * as sharedEnJson from '../../../../assets/i18n/en.json';
import { CompareLabelValueModule } from '../compare-label-value';
import { DimensionsWidgetComponent } from './dimensions-widget.component';

describe('DimensionsWidgetComponent', () => {
  let spectator: Spectator<DimensionsWidgetComponent>;
  const localizeNumber = jest.fn();
  const numberInput = 1_234_567.891_011;
  const numberOutput = '1.234.567,89';

  const createComponent = createComponentFactory({
    component: DimensionsWidgetComponent,
    imports: [
      UndefinedAttributeFallbackModule,
      provideTranslocoTestingModule({
        en: { compare: compareEnJson, ...sharedEnJson },
      }),
      CompareLabelValueModule,
    ],
    providers: [mockProvider(TranslocoLocaleService, { localizeNumber })],
  });

  beforeEach(() => {
    localizeNumber.mockReturnValue(numberOutput);
  });

  it('should create', () => {
    spectator = createComponent();
    expect(spectator.component).toBeTruthy();
  });

  it('should properly format values in template', () => {
    const data: DimensionAndWeightDetails = {
      height: numberInput,
      width: numberInput,
      length: numberInput,
      unitOfDimension: 'mm',
      weight: numberInput,
      weightUnit: 'gramm',
      volumeCubic: undefined,
      volumeUnit: undefined,
    };

    spectator = createComponent({ props: { data } });

    const valuesFromTemplate = spectator
      .queryAll('[data-cy="value"]')
      .map((element) => element.textContent);

    const expectedValues = [
      `${numberOutput} mm`,
      `${numberOutput} mm`,
      `${numberOutput} mm`,
      `${numberOutput} gramm`,
      'n.a.',
    ];

    expect(valuesFromTemplate).toEqual(expectedValues);
  });

  it('should show fallbacks for missing units', () => {
    const data: DimensionAndWeightDetails = {
      height: numberInput,
      width: numberInput,
      length: numberInput,
      unitOfDimension: undefined,
      weight: numberInput,
      weightUnit: undefined,
      volumeCubic: numberInput,
      volumeUnit: undefined,
    };

    spectator = createComponent({ props: { data } });

    const valuesFromTemplate = spectator
      .queryAll('[data-cy="value"]')
      .map((element) => element.textContent);

    const expectedValues = [
      `${numberOutput} `,
      `${numberOutput} `,
      `${numberOutput} `,
      `${numberOutput} `,
      `${numberOutput} `,
    ];

    expect(valuesFromTemplate).toEqual(expectedValues);
  });
});
