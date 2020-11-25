import { Observable } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';

import * as fromStore from '../../../core/store';
import { Material } from '../../../shared/models';

@Component({
  selector: 'ltp-material',
  templateUrl: './material.component.html',
})
export class MaterialComponent implements OnInit, OnDestroy {
  public materialForm = new FormGroup({
    materialControl: new FormControl(),
    heatTreatmentControl: new FormControl(),
  });

  public materialOptions: Observable<string[]>;
  public heatTreatmentOptions: Observable<Material[]>;

  constructor(private readonly store: Store<fromStore.LTPState>) {
    this.materialOptions = this.store.pipe(select(fromStore.getMaterialList));
    this.heatTreatmentOptions = this.store.pipe(
      select(fromStore.getHeatTreatmentList)
    );

    this.heatTreatmentOptions.subscribe((heatTreatmentOptions) => {
      const materialFormControls = this.materialForm.controls;
      heatTreatmentOptions.filter(
        (heatTreatmentOption) => !heatTreatmentOption.disabled
      ).length > 0
        ? materialFormControls.heatTreatmentControl.enable()
        : materialFormControls.heatTreatmentControl.disable();
    });
  }

  public ngOnInit(): void {
    this.resetForm(); // TODO: maybe trigger when settins sidebar reset ist triggered

    const materialFormControls = this.materialForm.controls;
    materialFormControls.materialControl.valueChanges.subscribe(
      (selectedMaterial) => {
        if (selectedMaterial) {
          this.materialForm.controls.heatTreatmentControl.patchValue(''); // for now that every heat treatment is bound to one material
          this.store.dispatch(fromStore.setMaterial({ selectedMaterial }));
        }
      }
    );

    materialFormControls.heatTreatmentControl.valueChanges.subscribe(
      (selectedHeatTreatment) => {
        if (selectedHeatTreatment) {
          const selectedHardness = selectedHeatTreatment.hardness;
          this.store.dispatch(fromStore.setHardness({ selectedHardness }));
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
    this.store.dispatch(fromStore.unsetMaterial());
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
