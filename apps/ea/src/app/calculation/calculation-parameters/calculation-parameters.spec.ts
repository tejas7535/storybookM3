import { MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { resetCalculationParameters } from '@ea/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { FormFieldModule } from '@ea/shared/form-field';
import {
  CALCULATION_PARAMETERS_STATE_MOCK,
  CALCULATION_RESULT_STATE_MOCK,
  PRODUCT_SELECTION_STATE_MOCK,
} from '@ea/testing/mocks';
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
      MockModule(FormFieldModule),

      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          calculationParameters: { ...CALCULATION_PARAMETERS_STATE_MOCK },
          calculationResult: { ...CALCULATION_RESULT_STATE_MOCK },
          productSelection: { ...PRODUCT_SELECTION_STATE_MOCK },
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

      expect(store.dispatch).toHaveBeenCalledWith(resetCalculationParameters());
    });
  });

  describe('loadValidator', () => {
    it('should unset the anyLoad error if one field is > 0', () => {
      component.radialLoad.setValue(0);
      component.axialLoad.setValue(0);

      component['loadValidator']();
      expect(component.radialLoad.errors).toEqual({
        anyLoad: true,
      });

      component.radialLoad.setValue(6);
      component['loadValidator']();

      /* eslint-disable unicorn/no-null */
      expect(component.radialLoad.errors).toEqual(null);
    });

    it('should set the anyLoad error if both fields are less then 0', () => {
      component.radialLoad.setValue(0);
      component.axialLoad.setValue(0);

      component['loadValidator']();

      expect(component.radialLoad.errors).toEqual({
        anyLoad: true,
      });
      expect(component.axialLoad.errors).toEqual({
        anyLoad: true,
      });
    });
  });
});
