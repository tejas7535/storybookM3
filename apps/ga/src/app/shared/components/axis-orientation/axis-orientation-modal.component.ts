import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { TranslocoService } from '@jsverse/transloco';

import { InfoBannerComponent } from '@schaeffler/feedback-banner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  standalone: true,
  selector: 'ga-axis-orientation-modal',
  templateUrl: './axis-orientation.component.html',
  imports: [
    MatDialogModule,
    SharedTranslocoModule,
    MatButtonModule,
    InfoBannerComponent,
  ],
})
export class AxisOrientationModalComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<AxisOrientationModalComponent>,
    public readonly translocoService: TranslocoService
  ) {}

  public close() {
    this.dialogRef.close(false);
  }

  public confirm() {
    this.dialogRef.close(true);
  }
}
