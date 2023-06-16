import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LabelValueModule } from '../../label-value.module';
import { mockValue } from '../../mocks/label-value.mocks';
import { LabelValueComponent } from './label-value.component';

describe('LabelValueComponent', () => {
  let spectator: Spectator<LabelValueComponent>;
  let component: LabelValueComponent;

  const createComponent = createComponentFactory({
    component: LabelValueComponent,
    imports: [LabelValueModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties and Inputs', () => {
    it('should define the properties', () => {
      expect(component.labelValues).toBeUndefined();
    });
  });

  describe('valueIsArray', () => {
    test('should return boolean', () => {
      const stringValue = component.valueIsArray('string');
      const arrayValue = component.valueIsArray([mockValue]);

      expect(stringValue).toEqual(false);
      expect(arrayValue).toEqual(true);
    });
  });
});
