import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { refreshSapPricing } from '../../../core/store';
import { RefreshSapPriceComponent } from './refresh-sap-price.component';

describe('RefreshSapPriceComponent', () => {
  let component: RefreshSapPriceComponent;
  let spectator: Spectator<RefreshSapPriceComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: RefreshSapPriceComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set simulationModeEnabled', () => {
      component.agInit();

      expect(component.simulationModeEnabled$).toBeDefined();
    });
  });

  describe('refreshSapPricing', () => {
    test('should upload to SAP', () => {
      store.dispatch = jest.fn();
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of(true),
          } as any)
      );
      component.refreshSapPricing();

      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledTimes(3);
      expect(store.dispatch).toHaveBeenLastCalledWith(refreshSapPricing());
    });
  });
});
