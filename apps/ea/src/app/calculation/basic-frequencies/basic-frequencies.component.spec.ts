import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import {
  downloadBasicFrequencies,
  fetchBasicFrequencies,
} from '@ea/core/store/actions/calculation-result/calculation-result.actions';
import {
  CALCULATION_RESULT_STATE_MOCK,
  PRODUCT_SELECTION_STATE_MOCK,
} from '@ea/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BasicFrequenciesComponent } from './basic-frequencies.component';

describe('BasicFrequenciesComponent', () => {
  let component: BasicFrequenciesComponent;
  let spectator: Spectator<BasicFrequenciesComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BasicFrequenciesComponent,
    imports: [
      PushModule,
      LetModule,

      // Material Modules
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatDialogModule),

      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          calculationResult: { ...CALCULATION_RESULT_STATE_MOCK },
          productSelection: { ...PRODUCT_SELECTION_STATE_MOCK },
        },
      }),
      {
        provide: translate,
        useValue: jest.fn(),
      },
      { provide: MatDialogRef, useValue: jest.fn() },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch load action', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(fetchBasicFrequencies());
    });
  });

  describe('saveAsPdf', () => {
    it('should dispatch download action', () => {
      component.saveAsPdf();

      expect(store.dispatch).toHaveBeenCalledWith(downloadBasicFrequencies());
    });
  });
});
