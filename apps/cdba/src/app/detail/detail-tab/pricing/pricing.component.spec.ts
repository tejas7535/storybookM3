import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { PricingComponent } from './pricing.component';

registerLocaleData(de);

describe('PricingComponent', () => {
  let spectator: Spectator<PricingComponent>;
  let component: PricingComponent;

  const createComponent = createComponentFactory({
    component: PricingComponent,
    imports: [
      UndefinedAttributeFallbackModule,
      provideTranslocoTestingModule({}),
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
