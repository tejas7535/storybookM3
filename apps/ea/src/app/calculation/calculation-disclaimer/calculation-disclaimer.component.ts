import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { StaticHTMLService } from '@ea/core/services/static-html.service';
import { PushModule } from '@ngrx/component';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-calculation-disclaimer',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    SharedTranslocoModule,
    MatIconModule,
    PushModule,
  ],
  templateUrl: './calculation-disclaimer.component.html',
})
export class CalculationDisclaimerComponent {
  public disclaimerContent$ =
    this.staticHTMLService.getHtmlContentByTranslationKey(
      'calculationResultReport.calculationDisclaimer.disclaimerFile'
    );

  constructor(
    private readonly dialogRef: MatDialogRef<CalculationDisclaimerComponent>,
    private readonly staticHTMLService: StaticHTMLService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
