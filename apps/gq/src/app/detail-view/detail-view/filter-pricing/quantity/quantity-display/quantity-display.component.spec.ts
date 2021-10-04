import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { QuantityDisplayComponent } from './quantity-display.component';

describe('QuantityDisplayComponent', () => {
  let component: QuantityDisplayComponent;
  let spectator: Spectator<QuantityDisplayComponent>;

  const createComponent = createComponentFactory({
    component: QuantityDisplayComponent,
    imports: [MatIconModule, MatDialogModule, ReactiveComponentModule],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            quotation: {},
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();

    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('openEditing', () => {
    test('should open dialog for editing', () => {
      component['dialog'].open = jest.fn();

      component.openEditing();

      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
    });
  });
});
