import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { LabelValueModule } from '../label-value/label-value.module';
import { PricingComponent } from './pricing.component';

describe('PricingComponent', () => {
  let spectator: Spectator<PricingComponent>;
  let component: PricingComponent;

  const createComponent = createComponentFactory({
    component: PricingComponent,
    imports: [
      UndefinedAttributeFallbackModule,
      provideTranslocoTestingModule({ en: {} }),
      LabelValueModule,
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
