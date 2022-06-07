import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { setBearingSelectionType } from '@ga/core/store';

import { AdvancedBearingButtonComponent } from './advanced-bearing-button.component';

describe('AdvancedBearingButtonComponent', () => {
  let component: AdvancedBearingButtonComponent;
  let spectator: Spectator<AdvancedBearingButtonComponent>;
  let router: Router;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AdvancedBearingButtonComponent,
    declarations: [AdvancedBearingButtonComponent],
    imports: [
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(MatButtonModule),
    ],
    providers: [provideMockStore()],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    router = spectator.inject(Router);
    store = spectator.inject(MockStore);

    router.navigate = jest.fn();
    store.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onButtonClick', () => {
    it('should navigate to the grease calculation route', () => {
      component.onButtonClick();

      expect(router.navigate).toHaveBeenCalledWith(['grease-calculation']);
    });

    it('should dispatch the bearing selection type action', () => {
      component.onButtonClick();

      expect(store.dispatch).toHaveBeenCalledWith(
        setBearingSelectionType({
          bearingSelectionType: 'ADVANCED_SELECTION',
        })
      );
    });
  });
});
