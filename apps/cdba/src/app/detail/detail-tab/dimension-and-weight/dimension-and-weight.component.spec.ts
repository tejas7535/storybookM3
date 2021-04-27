import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { DimensionAndWeightComponent } from './dimension-and-weight.component';

registerLocaleData(de);

describe('DimensionAndWeightComponent', () => {
  let spectator: Spectator<DimensionAndWeightComponent>;
  let component: DimensionAndWeightComponent;

  const createComponent = createComponentFactory({
    component: DimensionAndWeightComponent,
    imports: [
      UndefinedAttributeFallbackModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
