import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import {
  LanguageSelectModule,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculatorLogoComponent } from './calculator-logo.component';

describe('CalculatorLogoComponent', () => {
  let component: CalculatorLogoComponent;
  let spectator: Spectator<CalculatorLogoComponent>;

  const createComponent = createComponentFactory({
    component: CalculatorLogoComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockModule(LanguageSelectModule),
      MockModule(LocaleSelectModule),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });
});
