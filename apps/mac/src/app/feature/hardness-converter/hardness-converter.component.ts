import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HardnessConverterApiService } from './services/hardness-converter-api.service';
import {
  HardnessConversionResponseWithSide,
  InputSideTypes,
} from './services/hardness-converter-response.model';

@Component({
  selector: 'mac-hardness-converter',
  templateUrl: './hardness-converter.component.html',
  styleUrls: ['./hardness-converter.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('.3s ease-out', style({ height: 50, opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: 50, opacity: 1 }),
        animate('.3s ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class HardnessConverterComponent implements OnInit {
  inputSideTypes = InputSideTypes;

  public constructor(
    private readonly hardnessService: HardnessConverterApiService
  ) {}

  $inputSideChange = new Subject<InputSideTypes>();
  unitList: string[] = [];
  error: string;
  hardness = new FormGroup({
    fromUnit: new FormControl(''),
    toUnit: new FormControl(''),
    fromValue: new FormControl(0),
    toValue: new FormControl(0),
  });

  ngOnInit(): void {
    this.setupUnitList();
    this.setupConversionResultStream();
  }

  private setupUnitList(): void {
    this.hardnessService.getUnits().subscribe((units) => {
      this.unitList = units;
      this.hardness.patchValue({
        fromUnit: units[0],
        toUnit: units[1],
      });
    });
  }

  private setupConversionResultStream(): void {
    this.$inputSideChange
      .pipe(
        switchMap((sideChange: InputSideTypes) => {
          const fromSideChange = sideChange === this.inputSideTypes.from;

          return this.hardnessService.getConversionResult(
            fromSideChange
              ? this.hardness.get('fromUnit').value
              : this.hardness.get('toUnit').value,
            fromSideChange
              ? this.hardness.get('toUnit').value
              : this.hardness.get('fromUnit').value,
            fromSideChange
              ? this.hardness.get('fromValue').value
              : this.hardness.get('toValue').value,
            sideChange
          );
        })
      )
      .subscribe((conversionResult: HardnessConversionResponseWithSide) => {
        const fromSideChange =
          conversionResult.side === this.inputSideTypes.from;
        const controlToPatch = fromSideChange ? 'toValue' : 'fromValue';

        if (conversionResult.error) {
          const otherInput =
            controlToPatch === 'toValue' ? 'fromValue' : 'toValue';
          const otherInputHasValue = !!this.hardness.get(otherInput).value;

          this.error = conversionResult.error;

          if (otherInputHasValue) {
            this.hardness.patchValue({
              [controlToPatch]: undefined,
            });
          }
        } else {
          this.hardness.patchValue({
            [controlToPatch]: conversionResult.converted,
          });
        }
      });
  }

  handleKeyInput(key: string, value: string, sideChange: InputSideTypes): void {
    if (
      Number.isInteger(parseInt(key, 10)) ||
      key === 'Backspace' ||
      key === 'Delete'
    ) {
      this.convertValue(sideChange, value);
    }
  }

  convertValue(sideChange: InputSideTypes, val: string): void {
    if (val !== '') {
      this.error = undefined;
      this.$inputSideChange.next(sideChange);
    }
  }

  trackByFn(index: number): number {
    return index;
  }
}
