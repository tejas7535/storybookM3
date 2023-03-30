import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { addMaterials } from '@gq/core/store/actions';
import { getAddMaterialRowDataValid } from '@gq/core/store/selectors/process-case/process-case.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-create-case-button',
  templateUrl: './add-material-button.component.html',
})
export class AddMaterialButtonComponent implements OnInit {
  createCaseEnabled$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.createCaseEnabled$ = this.store.select(getAddMaterialRowDataValid);
  }

  addMaterial(): void {
    this.store.dispatch(addMaterials());
  }

  agInit(): void {}
}
