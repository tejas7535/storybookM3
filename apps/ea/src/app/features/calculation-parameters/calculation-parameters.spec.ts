import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { resetCalculationParams } from '@ea/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { FormFieldModule } from '@ea/shared/form-field';
import { CALCULATION_PARAMETERS_STATE_MOCK } from '@ea/testing/mocks';
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
      MockModule(MatIconModule),
      MockModule(MatTooltipModule),
      MockModule(FormFieldModule),

      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          ...CALCULATION_PARAMETERS_STATE_MOCK,
        },
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

      expect(store.dispatch).toHaveBeenCalledWith(resetCalculationParams());
    });
  });

  describe('loadValidator', () => {
    it('should unset the anyLoad error if one field is > 0', () => {
      component.radial.setValue(0);
      component.axial.setValue(0);

      component['loadValidator']();
      expect(component.radial.errors).toEqual({
        anyLoad: true,
      });

      component.radial.setValue(6);
      component['loadValidator']();

      /* eslint-disable unicorn/no-null */
      expect(component.radial.errors).toEqual(null);
    });

    it('should set the anyLoad error if both fields are less then 0', () => {
      component.radial.setValue(0);
      component.axial.setValue(0);

      component['loadValidator']();

      expect(component.radial.errors).toEqual({
        anyLoad: true,
      });
      expect(component.axial.errors).toEqual({
        anyLoad: true,
      });
    });
  });
});
