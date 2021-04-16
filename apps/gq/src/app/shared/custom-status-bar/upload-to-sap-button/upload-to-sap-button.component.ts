import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { isManualCase, uploadOfferToSap } from '../../../core/store';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';

@Component({
  selector: 'gq-upload-offer',
  templateUrl: './upload-to-sap-button.component.html',
  styleUrls: ['./upload-to-sap-button.component.scss'],
})
export class UploadToSapButtonComponent {
  isManualCase$: Observable<boolean>;

  agInit(): void {}

  constructor(private readonly store: Store<ProcessCaseState>) {
    this.isManualCase$ = this.store.select(isManualCase);
  }

  uploadToSAP(): void {
    this.store.dispatch(uploadOfferToSap());
  }
}
