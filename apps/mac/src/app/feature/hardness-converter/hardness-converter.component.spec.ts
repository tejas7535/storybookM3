import { waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import { HardnessConverterComponent } from './hardness-converter.component';
import { HardnessConverterApiService } from './services/hardness-converter-api.service';
import { InputSideTypes } from './services/hardness-converter-response.model';

const unitList = ['mPa', 'HV', 'HB', 'HrC'];

describe('HardnessConverterComponent', () => {
  let component: HardnessConverterComponent;
  let spectator: Spectator<HardnessConverterComponent>;

  const conversionResultOkay = { converted: '15' };
  const conversionResultError = { error: 'conversion impossible' };
  const createComponent = createComponentFactory({
    component: HardnessConverterComponent,
    imports: [
      BrowserAnimationsModule,
      MatFormFieldModule,
      MatInputModule,
      MatProgressSpinnerModule,
      MatSelectModule,
      ReactiveFormsModule,
      MatCardModule,
    ],
    declarations: [HardnessConverterComponent],
    providers: [
      {
        provide: HardnessConverterApiService,
        useValue: {
          getUnits: jest.fn(() => of(unitList)),
          getConversionResult: jest.fn((a) => {
            return Number.isInteger(parseInt(a, 10))
              ? of(conversionResultOkay)
              : of(conversionResultError);
          }),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('triggering conversion', () => {
    it('should push next value to the subject', () => {
      component.convertValue(InputSideTypes.from, '42');
      component.$inputSideChange.subscribe((side) => {
        expect(side).toEqual(InputSideTypes.from);
      });
    });

    it('should do nothing if input holds an empty string', () => {
      let wasGivenNextValue = false;
      component.convertValue(InputSideTypes.from, '');
      component.$inputSideChange.subscribe(() => (wasGivenNextValue = true));

      expect(wasGivenNextValue).toEqual(false);
    });
  });

  it('should setup the unit list', () => {
    expect(component.unitList).toEqual(unitList);
  });

  describe('conversion should apply to the opposite value', () => {
    it('should convert right-hand value when inputting the left-hand one', () => {
      waitForAsync(() => {
        const val = '1234';
        component.hardness.patchValue({
          fromUnit: 'mPa',
          toUnit: 'HV',
          fromValue: val,
        });
        component.convertValue(InputSideTypes.from, val);

        expect(component.hardness.get('toValue').value).toEqual(
          conversionResultOkay.converted
        );
      });
    });

    it('should convert left-hand value when inputting the right-hand one', () => {
      waitForAsync(() => {
        const val = '1234';
        component.hardness.patchValue({
          fromUnit: 'mPa',
          toUnit: 'HV',
          toValue: val,
        });
        component.convertValue(InputSideTypes.from, val);

        expect(component.hardness.get('fromValue').value).toEqual(
          conversionResultOkay.converted
        );
      });
    });
  });

  describe('handling keypresses', () => {
    it('should trigger value conversion on pressing a number', () => {
      const spy = jest.spyOn(component, 'convertValue');
      component.handleKeyInput('1', '101', InputSideTypes.to);
      expect(spy).toHaveBeenCalledWith(InputSideTypes.to, '101');
    });

    it('should not trigger value conversion when a non-number key is pressed', () => {
      const spy = jest.spyOn(component, 'convertValue');
      component.handleKeyInput('a', '101a', InputSideTypes.to);
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  it(
    'should handle errors returned by the service',
    waitForAsync(() => {
      component.hardness
        .get('fromValue')
        .setValue('totally wrong and unacceptable');
      component.$inputSideChange.next(InputSideTypes.from);
      expect(component.error).toEqual(conversionResultError.error);
    })
  );
});
