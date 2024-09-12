import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ProductCardComponent } from '../product-card/product-card.component';
import { HydraulicOrLockNutComponent } from './hydraulic-or-lock-nut.component';

describe('HydraulicOrLockNutComponent', () => {
  let spectator: Spectator<HydraulicOrLockNutComponent>;
  const createComponent = createComponentFactory({
    component: HydraulicOrLockNutComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(ProductCardComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should not display content when no hydraulic / lock nut is provided', () => {
    expect(spectator.query(ProductCardComponent)).not.toExist();
  });

  describe('when hydraulic / lock nut is provided', () => {
    beforeEach(() => {
      spectator.setInput('hydraulicOrLockNut', [
        {
          field: 'Hydraulic Nut 1',
          value: 'Hydraulic Nut 1 Value',
        },
      ]);

      spectator.setInput('title', 'translated nut title');
    });

    it('should display the hydraulic / lock nut', () => {
      expect(spectator.query(ProductCardComponent)).toExist();
    });

    it('should pass values to the product card component', () => {
      const productCard = spectator.query(ProductCardComponent);

      expect(productCard.productTitle).toBe('translated nut title');
      expect(productCard.productValue).toBe('Hydraulic Nut 1 Value');
    });
  });
});
