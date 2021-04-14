import { ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../../../../../assets/i18n/en.json';
import { TooltipModule } from './../../../../shared/components/tooltip/tooltip.module';
import { SliderComponent } from './slider.component';
import { SliderControl } from './slider.model';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let spectator: Spectator<SliderComponent>;

  const control = new SliderControl({
    key: 'test',
    name: 'TEST',
    disabled: false,
    formControl: new FormControl(),
    min: 0,
    max: 200,
    step: 1,
  });

  const createComponent = createComponentFactory({
    component: SliderComponent,
    declarations: [SliderComponent],
    imports: [
      ReactiveFormsModule,
      MatFormFieldModule,
      MatSliderModule,
      MatInputModule,
      NoopAnimationsModule,
      ReactiveComponentModule,
      TooltipModule,
      provideTranslocoTestingModule({ en }),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('control', control);
    spectator.detectChanges();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setEnabled should switch the disabled property of the form control', fakeAsync(() => {
    component.setDisabled(false);
    tick();
    expect(component.control.formControl.disabled).toEqual(false);

    component.setDisabled(true);
    tick();
    expect(component.control.formControl.disabled).toEqual(true);
  }));

  it('higher input as the max value should lead to correction', () => {
    spyOn(component, 'validate').and.callThrough();
    const input = spectator.query('input', { read: ElementRef }).nativeElement;

    input.value = 9999;
    input.dispatchEvent(new Event('change'));

    expect(component.validate).toHaveBeenCalled();
    expect(component.control.formControl.value).toEqual(component.control.max);
  });

  it('lower input as the min value should lead to correction', () => {
    spyOn(component, 'validate').and.callThrough();
    const input = spectator.query('input', { read: ElementRef }).nativeElement;

    input.value = -9999;
    input.dispatchEvent(new Event('change'));

    expect(component.validate).toHaveBeenCalled();
    expect(component.control.formControl.value).toEqual(component.control.min);
  });

  it('should not change the value if a valid input was entered', () => {
    spyOn(component, 'validate').and.callThrough();
    const input = spectator.query('input', { read: ElementRef }).nativeElement;
    component.control.step = 1;

    input.value = 10.5;
    input.dispatchEvent(new Event('change'));

    expect(component.validate).toHaveBeenCalled();
    expect(component.control.formControl.value).toEqual(10);
  });
});
