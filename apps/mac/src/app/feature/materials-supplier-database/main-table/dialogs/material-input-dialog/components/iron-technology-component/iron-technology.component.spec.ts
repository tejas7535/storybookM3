import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';

import * as en from '../../../../../../../../assets/i18n/en.json';
import { DialogControlsService } from '../../services';
import { IronTechnologyComponent } from './iron-technology.component';

@Injectable()
class MockDialogFacade extends DialogFacade {
  steelTechnologyComments$ = of([]);
  processJsonComments$ = of({});
  fetchProcessTechnologyComments = jest.fn();
  fetchProcessJsonComments = jest.fn();
}

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

const initialState = {
  msd: {
    data: {
      ...initialDataState,
    },
    dialog: {
      ...initialDialogState,
      dialogOptions: {
        ...initialDialogState.dialogOptions,
      },
    },
  },
};

describe('IronTechnologyComponent', () => {
  let component: IronTechnologyComponent;
  let spectator: Spectator<IronTechnologyComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: IronTechnologyComponent,
    // required so we can set the inputs
    detectChanges: false,
    imports: [
      MockPipe(PushPipe),
      MockModule(ReactiveFormsModule),
      MockModule(SelectModule),
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
      MockProvider(DialogFacade, MockDialogFacade, 'useClass'),
      MockProvider(DialogControlsService, {
        // generic function to create a FormControl
        getControl: <T>(val: T) => new FormControl<T>(val),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({
      ironTechnologyGroup: new FormGroup({}),
      steelTechnologyControl: new FormControl(),
      steelTechnologyCommentControl: new FormControl(),
      disableControl: new FormControl(true),
    });
    // run ngOnInit
    spectator.detectChanges();

    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('disableControl', () => {
    it('should disable controls if unchecked', () => {
      component.ironMakingControl.reset = jest.fn();
      component.steelMakingControl.reset = jest.fn();

      component.disableControl.setValue(false);

      expect(component.ironMakingControl.disabled).toBeTruthy();
      expect(component.steelMakingControl.disabled).toBeTruthy();
      expect(component.ironMakingControl.reset).toHaveBeenCalled();
      expect(component.steelMakingControl.reset).toHaveBeenCalled();
    });
    it('should enable controls if checked', () => {
      component.ironMakingControl.reset = jest.fn();
      component.steelMakingControl.reset = jest.fn();

      component.disableControl.setValue(true);

      expect(component.ironMakingControl.enabled).toBeTruthy();
      expect(component.steelMakingControl.enabled).toBeTruthy();
      expect(component.ironMakingControl.reset).not.toHaveBeenCalled();
      expect(component.steelMakingControl.reset).not.toHaveBeenCalled();
    });
  });

  describe('Steel Technology', () => {
    describe('modify steelMakingControl', () => {
      beforeEach(() => {
        component.steelTechnologyCommentControl.reset = jest.fn();
        component.steelTechnologyControl.reset = jest.fn();
        component.steelTechnologyControl.updateValueAndValidity = jest.fn();
      });
      it('should add required validator on enable', () => {
        component.steelMakingControl.setValue(true);

        expect(
          component.steelTechnologyCommentControl.reset
        ).not.toHaveBeenCalled();
        expect(component.steelTechnologyControl.reset).not.toHaveBeenCalled();
        expect(
          component.steelTechnologyControl.updateValueAndValidity
        ).toHaveBeenCalled();
        expect(
          component.steelTechnologyControl.hasValidator(Validators.required)
        ).toBeTruthy();
      });
      it('should remove required validator and reset controls on disable', () => {
        component.steelMakingControl.enable({ emitEvent: false });
        component.steelMakingControl.disable();

        expect(
          component.steelTechnologyCommentControl.reset
        ).toHaveBeenCalled();
        expect(component.steelTechnologyControl.reset).toHaveBeenCalled();
        expect(
          component.steelTechnologyControl.hasValidator(Validators.required)
        ).not.toBeTruthy();
        expect(
          component.steelTechnologyControl.updateValueAndValidity
        ).toHaveBeenCalled();
      });
    });

    describe('modify steelTechnologyControl', () => {
      it('should fetch the comments if value is changed', () => {
        component.steelTechnologyControl.setValue('type1');

        expect(
          component.dialogFacade.fetchProcessTechnologyComments
        ).toHaveBeenCalledWith('type1');
      });
    });

    describe('prepareSteel', () => {
      beforeEach(() => {
        component.steelMakingControl.reset();
        component.steelTechnologyControl.reset();
      });
      it('should set steelMaking to true if technology is prefilled', () => {
        component.steelTechnologyControl.setValue(true);
        component['prepareSteel']();
        expect(component.steelMakingControl.value).toBe(true);
      });
      it('should not set steelMaking to true if technology is NOT prefilled', () => {
        component['prepareSteel']();
        expect(component.steelMakingControl.value).toBeFalsy();
      });
    });
  });
  describe('Iron Technology', () => {
    describe('modify ironMakingControl', () => {
      beforeEach(() => {
        component['checkboxGroup'].reset = jest.fn();
      });
      it('should reset the checkbox group if unchecked', () => {
        component.ironMakingControl.setValue(false);

        expect(component['checkboxGroup'].reset).toHaveBeenCalled();
      });
      it('should not reset the checkbox group if checked', () => {
        component.ironMakingControl.setValue(true);

        expect(component['checkboxGroup'].reset).not.toHaveBeenCalled();
      });
    });

    describe('checkboxCheckedValidator', () => {
      beforeEach(() => {
        // reset all controls
        component.ironMakingControl.setValue(false);
      });
      it('should be valid if enable is unchecked', () => {
        expect(component.ironTechnologyGroup.valid).toBeTruthy();
      });
      it('should be invalid if no checkboxes are checked', () => {
        component.ironMakingControl.setValue(true);
        expect(component.ironTechnologyGroup.valid).toBeFalsy();
      });
      it('should be valid if any checkbox is checked', () => {
        component.ironMakingControl.setValue(true);
        component['checkboxGroup'].controls['bf'].setValue(true);
        expect(component.ironTechnologyGroup.valid).toBeTruthy();
      });
    });

    describe('mapToConfig', () => {
      it('should return a config object with the correct properties', (done) => {
        const technology = 'technology1';
        const sub = new Subject();
        const comments = ['1', '2'];
        const result = component['mapToConfig'](technology, sub);

        expect(result.tech).toEqual(technology);
        result.observable.subscribe((c: any) => {
          if (c === comments) {
            done();
          }
        });
        sub.next({
          [technology]: comments,
          other: ['3', '4'],
        });
      });
    });

    describe('link', () => {
      beforeEach(() => {
        component['checkboxGroup'].reset();
        component.ironTechnologyGroup.reset();
        component['ironTechnologies'].forEach((tech) => {
          component['checkboxGroup'].removeControl(tech);
          component.ironTechnologyGroup.removeControl(tech);
        });
      });
      const getConfig = () => ({
        tech: 'technology1',
        ctrl: new FormControl(),
        cmnt: new FormControl(),
        observable: of({}),
      });
      it('should add controls to validator group', () => {
        const config = getConfig();
        component['link'](config);

        expect(component['checkboxGroup'].controls[config.tech]).toBe(
          config.ctrl
        );
      });
      it('should fetch comments on enable', () => {
        const config = getConfig();
        component['link'](config);
        config.ctrl.setValue(true);
        expect(
          component.dialogFacade.fetchProcessJsonComments
        ).toHaveBeenCalledWith(config.tech);
        expect(
          component.ironTechnologyGroup.contains(config.tech)
        ).toBeTruthy();
      });
      it('should reset comments on disable', () => {
        const config = getConfig();
        component['link'](config);
        config.ctrl.setValue(true);
        config.cmnt.setValue('testComment');
        config.ctrl.setValue(false);
        expect(config.cmnt.value).toBeFalsy();
        expect(component.ironTechnologyGroup.contains(config.tech)).toBeFalsy();
      });
      it('should prefill values', () => {
        const config = getConfig();
        const testCtrl = new FormControl<string>('prefilledComment');
        component.ironTechnologyGroup.setControl(config.tech, testCtrl);
        component['link'](config);

        expect(config.ctrl.value).toBe(true);
        expect(config.cmnt.value).toBe(testCtrl.value);
        expect(component.ironMakingControl.value).toBe(true);
        expect(
          component.dialogFacade.fetchProcessJsonComments
        ).toHaveBeenCalledWith(config.tech);
      });
    });
  });
});
