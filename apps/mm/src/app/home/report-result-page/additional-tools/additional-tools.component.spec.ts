import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ProductCardComponent } from '../product-card/product-card.component';
import { AdditionalToolsComponent } from './additional-tools.component';

describe('AdditionalToolsComponent', () => {
  let spectator: Spectator<AdditionalToolsComponent>;

  const createComponent = createComponentFactory({
    component: AdditionalToolsComponent,
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

  describe('when additional tools are provided', () => {
    beforeEach(() => {
      spectator.setInput('additionalTools', [
        {
          designation: 'Tool 1',
          value: 'Tool 1 value',
          imagePath: 'Tool 1 Image Path',
        },
        {
          designation: 'Tool 2',
          value: 'Tool 2 value',
          imagePath: 'Tool 2 Image Path',
        },
      ]);
    });

    it('should display the tools', () => {
      expect(spectator.queryAll('mm-product-card')).toHaveLength(2);
    });

    it('should dispaly title', () => {
      expect(spectator.query('h3')).toExist();
    });

    it('should pass values to the product card component', () => {
      const productCards = spectator.queryAll(ProductCardComponent);

      expect(productCards[0].productTitle).toBe('Tool 1');
      expect(productCards[0].productValue).toBe('Tool 1 value');

      expect(productCards[1].productTitle).toBe('Tool 2');
      expect(productCards[1].productValue).toBe('Tool 2 value');
    });
  });
});
