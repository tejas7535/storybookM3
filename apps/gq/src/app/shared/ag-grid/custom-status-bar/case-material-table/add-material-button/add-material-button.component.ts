import { Component, inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { getAddMaterialRowDataValid } from '@gq/core/store/process-case';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-add-material-button',
  templateUrl: './add-material-button.component.html',
  standalone: false,
})
export class AddMaterialButtonComponent implements OnInit {
  createCaseEnabled$: Observable<boolean>;

  private readonly store: Store = inject(Store);

  ngOnInit(): void {
    this.createCaseEnabled$ = this.store.select(getAddMaterialRowDataValid);
  }

  addMaterial(): void {
    this.store.dispatch(ActiveCaseActions.addMaterialsToQuotation());
  }

  agInit(): void {}
}
