import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DetailsLabelValueModule } from '../details-label-value';
import { PricingComponent } from './pricing.component';

describe('PricingComponent', () => {
  let spectator: Spectator<PricingComponent>;
  let component: PricingComponent;

  const createComponent = createComponentFactory({
    component: PricingComponent,
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
