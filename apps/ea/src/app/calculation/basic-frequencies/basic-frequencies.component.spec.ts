import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { CatalogCalculationResultActions } from '@ea/core/store/actions';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { translate } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
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
      PushPipe,
      LetDirective,

      // Material Modules
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatDialogModule),

      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
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

      expect(store.dispatch).toHaveBeenCalledWith(
        CatalogCalculationResultActions.fetchBasicFrequencies()
      );
    });
  });

  describe('saveAsPdf', () => {
    it('should dispatch download action', () => {
      component.saveAsPdf();

      expect(store.dispatch).toHaveBeenCalledWith(
        CatalogCalculationResultActions.downloadBasicFrequencies()
      );
    });
  });
});
