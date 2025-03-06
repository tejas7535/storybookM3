import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MsdDataService } from '@mac/feature/materials-supplier-database/services';

@Component({
  selector: 'mac-pdf-viewer',
  imports: [
    // default
    CommonModule,
    // angular material
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    // libs
    SharedTranslocoModule,
  ],
  templateUrl: './pdf-viewer.component.html',
})
export class PdfViewerComponent {
  public base64: SafeResourceUrl;

  constructor(
    private readonly dataService: MsdDataService,
    private readonly sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) private readonly id: number
  ) {
    this.dataService.getUploadFile(this.id).subscribe((blob) => {
      this.base64 = this.sanitizer.bypassSecurityTrustResourceUrl(blob);
    });
  }
}
