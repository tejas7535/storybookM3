import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedModule } from '../../shared/shared.module';
import { AdvancedBearingComponent } from './advanced-bearing.component';

describe('AdvancedBearingComponent', () => {
  let component: AdvancedBearingComponent;
  let spectator: Spectator<AdvancedBearingComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AdvancedBearingComponent,
    imports: [
      RouterTestingModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({ en: {} }),
      MatDividerModule,
      SharedModule,
      ReactiveComponentModule,
      MatButtonModule,
      MatSnackBarModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            search: {
              query: undefined,
              resultList: [],
            },
            extendedSearch: {
              parameters: {
                pattern: '',
                bearingType: 'IDO_RADIAL_ROLLER_BEARING',
                minDi: undefined,
                maxDi: undefined,
                minDa: undefined,
                maxDa: undefined,
                minB: undefined,
                maxB: undefined,
              },
              resultList: [],
            },
            loading: false,
            selectedBearing: undefined,
          },
        },
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [AdvancedBearingComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
    component['snackbar'].open = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    test('trigger the handleSubscriptions', () => {
      const componenthandleSubscriptionsSpy = jest.spyOn(
        component,
        'handleSubscriptions'
      );
      component.ngOnInit();

      expect(componenthandleSubscriptionsSpy).toHaveBeenCalled();
    });
  });

  describe('innerOuterValidator', () => {
    it('should show errors when inner > outer diameter', () => {
      component.minDi.patchValue(10);
      component.minDa.patchValue(5);
      const mockControl = new FormControl();

      const result = component['innerOuterValidator']()(mockControl);

      expect(result).toEqual({
        innerOuterInconsistent: true,
      });
    });

    it('should show no errors inner < outer diameter', () => {
      component.minDi.patchValue(5);
      component.minDa.patchValue(15);
      const mockControl = new FormControl();

      const result = component['innerOuterValidator']()(mockControl);

      expect(result).toEqual(undefined);
    });
  });

  describe('minMaxDiValidator', () => {
    it('should show errors when inner > outer diameter', () => {
      component.minDi.patchValue(10);
      component.maxDi.patchValue(5);
      const mockControl = new FormControl();

      const result = component['minMaxDiValidator']()(mockControl);

      expect(result).toEqual({
        minMaxInconsistent: true,
      });
    });

    it('should show no errors inner < outer diameter', () => {
      component.minDi.patchValue(10);
      component.maxDi.patchValue(15);
      const mockControl = new FormControl();

      const result = component['minMaxDiValidator']()(mockControl);

      expect(result).toEqual(undefined);
    });
  });

  describe('minMaxDaValidator', () => {
    it('should show errors when inner > outer diameter', () => {
      component.minDa.patchValue(10);
      component.maxDa.patchValue(5);
      const mockControl = new FormControl();

      const result = component['minMaxDaValidator']()(mockControl);

      expect(result).toEqual({
        minMaxInconsistent: true,
      });
    });

    it('should show no errors inner < outer diameter', () => {
      component.minDa.patchValue(10);
      component.maxDa.patchValue(15);
      const mockControl = new FormControl();

      const result = component['minMaxDaValidator']()(mockControl);

      expect(result).toEqual(undefined);
    });
  });

  describe('minMaxBValidator', () => {
    it('should show errors when inner > outer diameter', () => {
      component.minB.patchValue(10);
      component.maxB.patchValue(5);
      const mockControl = new FormControl();

      const result = component['minMaxBValidator']()(mockControl);

      expect(result).toEqual({
        minMaxInconsistent: true,
      });
    });

    it('should show no errors inner < outer diameter', () => {
      component.minB.patchValue(10);
      component.maxB.patchValue(15);
      const mockControl = new FormControl();

      const result = component['minMaxBValidator']()(mockControl);

      expect(result).toEqual(undefined);
    });
  });

  describe('invalidMinMax', () => {
    it('should return true if both values are there and min > max', () => {
      const result = component['invalidMinMax'](10, 5);

      expect(result).toBe(true);
    });
  });
});
