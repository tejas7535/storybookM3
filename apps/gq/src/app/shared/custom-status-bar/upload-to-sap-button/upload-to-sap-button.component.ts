import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { uploadOfferToSap } from '../../../core/store';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';

@Component({
  selector: 'gq-upload-offer',
  templateUrl: './upload-to-sap-button.component.html',
  styleUrls: ['./upload-to-sap-button.component.scss'],
})
export class UploadToSapButtonComponent {
  agInit(): void {}

  constructor(private readonly store: Store<ProcessCaseState>) {}

  uploadToSAP(): void {
    this.store.dispatch(uploadOfferToSap());
  }
}
