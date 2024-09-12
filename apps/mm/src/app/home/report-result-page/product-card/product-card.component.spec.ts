import { NgOptimizedImage } from '@angular/common';
import { MatCard } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockDirective } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MediasViewProductButtonComponent } from '../medias-view-product-button/medias-view-product-button.component';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let spectator: Spectator<ProductCardComponent>;
  let component: ProductCardComponent;

  const createComponent = createComponentFactory({
    component: ProductCardComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockDirective(NgOptimizedImage),
      MockComponent(MediasViewProductButtonComponent),
      MockComponent(MatCard),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render medias button component', () => {
    expect(spectator.query(MediasViewProductButtonComponent)).toExist();
  });

  describe('when product card inputs are provided', () => {
    beforeEach(() => {
      spectator.setInput('productTitle', 'Product Title');
      spectator.setInput('productValue', 'Product Value');
    });

    it('should display the product card', () => {
      expect(spectator.query('.text-caption')).toHaveText('Product Title');
      expect(spectator.query('.text-subtitle-1')).toHaveText('Product Value');
    });
  });
});
