import { CustomFormControl } from '../input.model';

export class SliderControl extends CustomFormControl {
  min: number;
  max: number;
  step: number;

  constructor(object: any) {
    super(object);
    this.min = object.min;
    this.max = object.max;
    this.step = object.step;
  }
}
