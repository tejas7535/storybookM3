import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ProductCardComponent } from '../product-card/product-card.component';
import { ReportPumpsComponent } from './report-pumps.component';

describe('ReportPumpsComponent', () => {
  let spectator: Spectator<ReportPumpsComponent>;

  const createComponent = createComponentFactory({
    component: ReportPumpsComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(ProductCardComponent),
    ],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should not display content when no pumps are provided', () => {
    expect(spectator.query(ProductCardComponent)).not.toExist();
  });

  describe('when pumps are provided', () => {
    beforeEach(() => {
      spectator.setInput('pumps', [
        {
          field: 'Pump 1',
          value: 'Pump 1 Value',
          isRecommended: true,
        },
        {
          field: 'Pump 2',
          value: 'Pump 2 Value',
          isRecommended: false,
        },
      ]);
    });

    it('should display the pumps', () => {
      expect(spectator.queryAll(ProductCardComponent)).toHaveLength(2);
    });

    it('should pass values to the product card component', () => {
      const productCards = spectator.queryAll(ProductCardComponent);

      expect(productCards[0].productTitle).toBe('Pump 1');
      expect(productCards[0].productValue).toBe('Pump 1 Value');

      expect(productCards[1].productTitle).toBe('Pump 2');
      expect(productCards[1].productValue).toBe('Pump 2 Value');
    });
  });
});
