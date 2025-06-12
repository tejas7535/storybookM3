import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

import { provideTranslocoScope } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-ip-exposure',
  templateUrl: './ip-exposure.component.html',
  imports: [SharedTranslocoModule, MatButtonModule],
  providers: [provideTranslocoScope('ip-exposure')],
})
export class IpExposureComponent {
  private readonly dialogRef: MatDialogRef<IpExposureComponent> =
    inject(MatDialogRef);

  closeDialog(): void {
    this.dialogRef.close();
  }
}
