import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mm-mobile-download-pdf-button',
  templateUrl: './mobile-download-pdf-button.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
    MatProgressSpinnerModule,
  ],
})
export class MobileDownloadPdfButtonComponent {
  readonly isPdfGenerating = input<boolean>();
  readonly downloadPdfClicked = output();

  onDownloadPdfClicked(): void {
    this.downloadPdfClicked.emit();
  }
}
