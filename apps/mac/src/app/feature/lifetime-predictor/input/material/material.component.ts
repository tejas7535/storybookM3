import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Material } from '../../models';
import {
  getHeatTreatmentList,
  getMaterialList,
  setHardness,
  setMaterial,
  unsetMaterial,
} from './../../store';

@Component({
  selector: 'mac-ltp-material',
  templateUrl: './material.component.html',
})
export class MaterialComponent implements OnInit, OnDestroy {
  public materialForm = new UntypedFormGroup({
    materialControl: new UntypedFormControl(),
    heatTreatmentControl: new UntypedFormControl(),
  });

  public materialOptions: Observable<string[]>;
  public heatTreatmentOptions: Observable<Material[]>;

  constructor(private readonly store: Store) {
    this.materialOptions = this.store.select(getMaterialList);
    this.heatTreatmentOptions = this.store.select(getHeatTreatmentList);

    this.heatTreatmentOptions.subscribe((heatTreatmentOptions) => {
      const materialFormControls = this.materialForm.controls;

      const heatTreatmentOptionsEnabled = heatTreatmentOptions.filter(
        (heatTreatmentOption) => !heatTreatmentOption.disabled
      );
      if (heatTreatmentOptionsEnabled.length > 0) {
        materialFormControls.heatTreatmentControl.enable();
      } else {
        materialFormControls.heatTreatmentControl.disable();
      }
    });
  }

  public ngOnInit(): void {
    this.resetForm(); // TODO: maybe trigger when settins sidebar reset ist triggered

    const materialFormControls = this.materialForm.controls;
    materialFormControls.materialControl.valueChanges.subscribe(
      (selectedMaterial) => {
        if (selectedMaterial) {
          this.materialForm.controls.heatTreatmentControl.patchValue(''); // for now that every heat treatment is bound to one material
          this.store.dispatch(setMaterial({ selectedMaterial }));
        }
      }
    );

    materialFormControls.heatTreatmentControl.valueChanges.subscribe(
      (selectedHeatTreatment) => {
        if (selectedHeatTreatment) {
          const selectedHardness = selectedHeatTreatment.hardness;
          this.store.dispatch(setHardness({ selectedHardness }));
        }
      }
    );
  }

  public ngOnDestroy(): void {
    this.resetForm(); // TODO: maybe trigger when settins sidebar reset ist triggered
  }

  /**
   * Shows heattreatment as displayvalue but actualy hardness gets processed
   */
  public displayFn(heatTreatmentOption?: Material): string | undefined {
    return heatTreatmentOption ? heatTreatmentOption.heatTreatment : undefined;
  }

  /**
   * Removes selected values if HV10 is changed in parent component
   */
  public resetForm(): void {
    this.materialForm.reset();
    this.store.dispatch(unsetMaterial());
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
