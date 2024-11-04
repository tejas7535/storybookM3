import { MatSnackBar } from '@angular/material/snack-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { AddToCartButtonComponent } from './add-to-cart-button.component';

describe('AddToCartButtonComponent', () => {
  let spectator: Spectator<AddToCartButtonComponent>;
  const createComponent = createComponentFactory({
    component: AddToCartButtonComponent,
    mocks: [MatSnackBar],
  });

  beforeEach(() => {
    spectator = createComponent();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should emit addToCart event and show snackbar on button click', () => {
    const addToCartSpy = jest.spyOn(spectator.component.addToCart, 'emit');
    const snackBarSpy = jest.spyOn(spectator.inject(MatSnackBar), 'open');

    spectator.setInput('label', 'Add to Cart');
    spectator.setInput('snackbarMessage', 'Item added to cart');

    spectator.click('button');

    expect(addToCartSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalledWith('Item added to cart', '', {
      duration: 3000,
    });
    expect(spectator.component.disabled).toBe(true);

    jest.advanceTimersByTime(3000);

    expect(spectator.component.disabled).toBe(false);
  });

  it('should disable the button after click and re-enable after timeout', () => {
    spectator.setInput('label', 'Add to Cart');
    spectator.setInput('snackbarMessage', 'Item added to cart');

    spectator.click('button');

    expect(spectator.component.disabled).toBe(true);

    jest.advanceTimersByTime(3000);

    expect(spectator.component.disabled).toBe(false);
  });
});
