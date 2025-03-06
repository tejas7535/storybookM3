import { CommonModule } from '@angular/common';
import { Component, Inject, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mac-more-information-dialog',
  templateUrl: './more-information-dialog.component.html',
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    // libs
    SharedTranslocoModule,
  ],
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
