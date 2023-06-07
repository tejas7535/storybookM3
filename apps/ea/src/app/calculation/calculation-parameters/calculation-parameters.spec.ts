import { MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { resetCalculationParameters } from '@ea/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationParametersComponent } from './calculation-parameters';

describe('CalculationParametersComponent', () => {
  let component: CalculationParametersComponent;
  let spectator: Spectator<CalculationParametersComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CalculationParametersComponent,
    imports: [
      PushModule,
      LetModule,

      // Material Modules
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatTooltipModule),

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

  describe('ngOnDestroy', () => {
    it('should call the destroy methods', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('onResetButtonClick', () => {
    it('should reset the form with initialState', () => {
      component.form.reset = jest.fn();

      component.onResetButtonClick();

      expect(store.dispatch).toHaveBeenCalledWith(resetCalculationParameters());
    });
  });
});
