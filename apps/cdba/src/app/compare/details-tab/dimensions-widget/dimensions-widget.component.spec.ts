import { CommonModule, DecimalPipe, registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { LOCALE_ID } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DimensionAndWeightDetails } from '@cdba/detail/detail-tab/dimension-and-weight/model/dimension-and-weight-details.model';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import * as compareEnJson from '../../../../assets/i18n/compare/en.json';
import * as sharedEnJson from '../../../../assets/i18n/en.json';
import { LabelValueModule } from '../label-value/label-value.module';
import { DimensionsWidgetComponent } from './dimensions-widget.component';

const locale = 'de-DE';
registerLocaleData(de, locale);

describe('DimensionsWidgetComponent', () => {
  let spectator: Spectator<DimensionsWidgetComponent>;

  const createComponent = createComponentFactory({
    component: DimensionsWidgetComponent,
    imports: [
      CommonModule,
      UndefinedAttributeFallbackModule,
      provideTranslocoTestingModule({
        en: { compare: compareEnJson, ...sharedEnJson },
      }),
      LabelValueModule,
    ],
    providers: [{ provide: LOCALE_ID, useValue: locale }, DecimalPipe],
  });

  it('should create', () => {
    spectator = createComponent();
    expect(spectator.component).toBeTruthy();
  });

  it('should properly format values in template', () => {
    const data: DimensionAndWeightDetails = {
      height: 7.568_79,
      width: 10,
      length: 5,
      unitOfDimension: 'mm',
      weight: 10_000,
      weightUnit: 'gramm',
      volumeCubic: undefined,
      volumeUnit: undefined,
    };

    spectator = createComponent({ props: { data } });

    const valuesFromTemplate = spectator
      .queryAll('[data-cy="value"]')
      .map((element) => element.textContent);

    const expectedValues = [
      '5 mm',
      '10 mm',
      '7,569 mm',
      '10.000 gramm',
      'n.a.',
    ];

    expect(valuesFromTemplate).toEqual(expectedValues);
  });
});
