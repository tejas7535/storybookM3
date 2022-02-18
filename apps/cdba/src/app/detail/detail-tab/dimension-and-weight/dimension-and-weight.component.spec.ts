import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DetailsLabelValueModule } from '../details-label-value';
import { DimensionAndWeightComponent } from './dimension-and-weight.component';

describe('DimensionAndWeightComponent', () => {
  let spectator: Spectator<DimensionAndWeightComponent>;
  let component: DimensionAndWeightComponent;

  const createComponent = createComponentFactory({
    component: DimensionAndWeightComponent,
    imports: [
      UndefinedAttributeFallbackModule,
      provideTranslocoTestingModule({ en: {} }),
      DetailsLabelValueModule,
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
