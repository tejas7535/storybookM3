import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DimensionAndWeightDetails } from '@cdba/detail/detail-tab/dimension-and-weight/model/dimension-and-weight-details.model';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import * as compareEnJson from '../../../../assets/i18n/compare/en.json';
import * as sharedEnJson from '../../../../assets/i18n/en.json';
import { LabelValueModule } from '../label-value/label-value.module';
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
      LabelValueModule,
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
});
