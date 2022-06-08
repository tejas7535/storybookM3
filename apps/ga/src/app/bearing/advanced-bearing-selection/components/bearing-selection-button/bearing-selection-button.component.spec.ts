import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BearingSelectionButtonComponent } from './bearing-selection-button.component';

describe('BearingSelectionButtonComponent', () => {
  let component: BearingSelectionButtonComponent;
  let spectator: Spectator<BearingSelectionButtonComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BearingSelectionButtonComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockModule(LetModule),
      MockModule(MatButtonModule),
      MockModule(MatIconModule),
      MockModule(MatProgressSpinnerModule),
      MockModule(MatTooltipModule),
    ],
    providers: [provideMockStore()],
    declarations: [BearingSelectionButtonComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onButtonClick', () => {
    it('should emit an event', () => {
      component.buttonClick.emit = jest.fn();
      component.onButtonClick();

      expect(component.buttonClick.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('isValidSelection', () => {
    it('should return true', () => {
      const value = component.isValidSelection(50);

      expect(value).toBe(true);
    });

    it('should return false', () => {
      const value = component.isValidSelection(501);

      expect(value).toBe(false);
    });
  });
});
