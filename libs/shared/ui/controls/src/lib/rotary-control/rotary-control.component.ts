import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { RotaryControlItem } from './rotary-control.model';

@Component({
  selector: 'schaeffler-rotary-control',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './rotary-control.component.html',
  styleUrls: ['./rotary-control.component.scss'],
})
export class RotaryControlComponent {
  @Input() public controlItems: RotaryControlItem[] = [];
  @Input() public controlValue = 0;
  @Input() public controlValueChangeable = false;
  @Input() public offsetAngle = 0;
  @Input() public rotateScale = false;

  @Output() public readonly controlValueChanged = new EventEmitter<number>();

  public getRotationFromValue = (): number =>
    this.controlValue
      ? this.calculatedRotationAngle() * this.controlValue +
        this.calculatedOffsetAngle()
      : 0;

  public getScaleRotation = (index: number): number =>
    index
      ? this.calculatedRotationAngle() * index +
        this.calculatedOffsetAngle() -
        90
      : -90;

  public onScaleMarkClick = (index: number): void => {
    if (this.controlValueChangeable) {
      this.controlValue = index;
      this.controlValueChanged.emit(index);
    }
  };

  private readonly calculatedRotationAngle = (): number =>
    this.offsetAngle
      ? (360 - this.offsetAngle) / this.controlItems.length
      : 360 / this.controlItems.length;

  private readonly calculatedOffsetAngle = (): number =>
    this.offsetAngle ? this.offsetAngle / 2 : 0;
}
