import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  addMaterials,
  getAddMaterialRowDataValid,
} from '../../../../core/store';
import { ProcessCaseState } from '../../../../core/store/reducers/process-case/process-case.reducer';

@Component({
  selector: 'gq-create-case-button',
  templateUrl: './add-material-button.component.html',
})
export class AddMaterialButtonComponent implements OnInit {
  createCaseEnabled$: Observable<boolean>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  ngOnInit(): void {
    this.createCaseEnabled$ = this.store.select(getAddMaterialRowDataValid);
  }

  addMaterial(): void {
    this.store.dispatch(addMaterials());
  }

  agInit(): void {}
}
