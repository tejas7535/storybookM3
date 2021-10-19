import { SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { LimitsComponent } from './limits.component';

describe('LimitsComponent', () => {
  let component: LimitsComponent;
  let spectator: Spectator<LimitsComponent>;

  const createComponent = createComponentFactory({
    component: LimitsComponent,
    declarations: [LimitsComponent],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSliderModule,
      NoopAnimationsModule,
      provideTranslocoTestingModule({ en }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnChanges', () => {
    let changes: SimpleChanges;

    beforeEach(() => {
      component.adjustSliders = jest.fn();
    });

    it('should call adjustSliders when input of hv has changed', () => {
      changes = {
        hv: {
          previousValue: 10,
          currentValue: 20,
          firstChange: false,
          isFirstChange: undefined,
        },
      };

      component.ngOnChanges(changes);

      expect(component.adjustSliders).toHaveBeenCalled();
    });

    it('should not call adjustSliders when the value of hv has not changed', () => {
      changes = {
        hv: {
          previousValue: 10,
          currentValue: 10,
          firstChange: false,
          isFirstChange: undefined,
        },
      };

      component.ngOnChanges(changes);

      expect(component.adjustSliders).not.toHaveBeenCalled();
    });
  });

  it('should have a adjustSliders method', () => {
    expect(component.adjustSliders).toBeDefined();

    component.hv = 300;
    component.adjustSliders();
    expect(component.upperMax).toBe(330);
    expect(component.lowerMin).toBe(270);
    expect(component.limitForm.controls.hv_upper.value).toBe(300);
    expect(component.limitForm.controls.hv_lower.value).toBe(300);
  });

  it('should have a patchLimits method', () => {
    const mockValue = 123;
    const mockType = 'hv_lower';
    component.limitForm.controls.hv_upper.patchValue(567);

    const mockExpectedAdjustEvent = {
      hv_lower: 123,
      hv_upper: 567,
    };
    expect(component.patchLimits).toBeDefined();
    jest.spyOn(component.adjust, 'emit');

    component.patchLimits(mockValue, mockType);
    // fixture.detectChanges();
    expect(component.adjust.emit).toHaveBeenCalledWith(mockExpectedAdjustEvent);
  });

  it('should have a patchInput method', () => {
    jest.spyOn(component, 'patchLimits');
    expect(component.patchInput).toBeDefined();
    const mockSrcElement = {
      min: 100,
      max: 300,
    };

    component.patchInput({ value: 200, ...mockSrcElement }, 'hv_upper');
    expect(component.patchLimits).toHaveBeenCalledWith(200, 'hv_upper');

    component.patchInput({ value: 50, ...mockSrcElement }, 'hv_upper');
    expect(component.patchLimits).toHaveBeenCalledWith(100, 'hv_upper');

    component.patchInput({ value: 400, ...mockSrcElement }, 'hv_upper');
    expect(component.patchLimits).toHaveBeenCalledWith(300, 'hv_upper');
  });
});
