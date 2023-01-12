import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective } from 'ng-mocks';

import { HideIfQuotationHasStatusDirective } from './../../../../../shared/directives/hide-if-quotation-has-status/hide-if-quotation-has-status.directive';
import { QuantityDisplayComponent } from './quantity-display.component';

describe('QuantityDisplayComponent', () => {
  let component: QuantityDisplayComponent;
  let spectator: Spectator<QuantityDisplayComponent>;

  const createComponent = createComponentFactory({
    component: QuantityDisplayComponent,
    imports: [MatIconModule, MatDialogModule, PushModule],
    declarations: [MockDirective(HideIfQuotationHasStatusDirective)],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
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
