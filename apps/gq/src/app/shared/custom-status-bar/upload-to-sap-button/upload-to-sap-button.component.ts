import { Component } from '@angular/core';

@Component({
  selector: 'gq-finish-offer',
  templateUrl: './upload-to-sap-button.component.html',
  styleUrls: ['./upload-to-sap-button.component.scss'],
})
export class UploadToSapButtonComponent {
  agInit(): void {}

  uploadToSAP(): void {
    alert('upload to SAP not yet Implemented');
  }
}
