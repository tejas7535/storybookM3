import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { RotaryControlComponent } from './rotary-control.component';
import { RotaryControlItem } from './rotary-control.model';

const mockValue = 4;
const mockItems: RotaryControlItem[] = Array.from(
  { length: 13 },
  (_, index) => ({
    label: index.toString(),
  })
);

describe('RotaryControlComponent', () => {
  let component: RotaryControlComponent;
  let spectator: Spectator<RotaryControlComponent>;

  const createComponent = createComponentFactory(RotaryControlComponent);

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getRotationFromValue', () => {
    it('should return 0', () => {
      expect(component.getRotationFromValue()).toBe(0);
    });

    it('should return the calculated angle', () => {
      component.controlValue = mockValue;
      component.controlItems = mockItems;

      expect(component.getRotationFromValue()).toBe(110.769_230_769_230_77);
    });

    it('should return the calculated angle with offset', () => {
      component.offsetAngle = 45;
      component.controlValue = mockValue;
      component.controlItems = mockItems;

      expect(component.getRotationFromValue()).toBe(119.423_076_923_076_92);
    });
  });

  describe('getScaleRotation', () => {
    it('should return -90', () => {
      expect(component.getScaleRotation(0)).toBe(-90);
    });

    it('should return the calculated angle', () => {
      component.controlItems = mockItems;

      expect(component.getScaleRotation(6)).toBe(76.153_846_153_846_16);
    });
  });

  describe('onScaleMarkClick', () => {
    it('should do nothing', () => {
      component.controlValueChangeable = false;
      component.controlValueChanged.emit = jest.fn();
      component.onScaleMarkClick(2);

      expect(component.controlValueChanged.emit).not.toHaveBeenCalled();
    });

    it('should emit the controlValueChanged event', () => {
      component.controlValueChangeable = true;
      component.controlValueChanged.emit = jest.fn();
      component.onScaleMarkClick(2);

      expect(component.controlValueChanged.emit).toHaveBeenCalledWith(2);
    });

    it('should set the controlValue', () => {
      component.controlValue = 3;
      component.controlValueChangeable = true;
      component.onScaleMarkClick(4);

      expect(component.controlValue).toBe(4);
    });
  });
});
