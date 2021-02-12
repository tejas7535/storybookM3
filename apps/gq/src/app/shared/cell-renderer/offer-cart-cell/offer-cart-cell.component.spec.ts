import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { OfferCartCellComponent } from './offer-cart-cell.component';

describe('OfferCartCellComponent', () => {
  let component: OfferCartCellComponent;
  let spectator: Spectator<OfferCartCellComponent>;

  const createComponent = createComponentFactory({
    component: OfferCartCellComponent,
    declarations: [OfferCartCellComponent],
    imports: [MatIconModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      const params: any = {
        value: true,
      };
      component.agInit(params);

      expect(component.addToOffer).toBeTruthy();
    });
  });
});
