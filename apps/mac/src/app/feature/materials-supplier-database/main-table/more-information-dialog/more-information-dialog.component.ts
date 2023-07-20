import { Component, Inject, TemplateRef } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

@Component({
  selector: 'mac-more-information-dialog',
  templateUrl: './more-information-dialog.component.html',
})
export class MoreInformationDialogComponent {
  constructor(
    readonly dialogRef: MatDialogRef<MoreInformationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    readonly dialogData: {
      title?: string;
      topText?: string;
      imageSrc?: string;
      imageCaption?: string;
      bottomText?: string;
      contact?: string;
      mailToLink?: string;
      bottomTemplate?: TemplateRef<any>;
    }
  ) {}

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
