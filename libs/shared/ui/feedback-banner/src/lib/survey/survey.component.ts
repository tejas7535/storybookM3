import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  templateUrl: './survey.component.html',
  standalone: true,
  imports: [MatIconModule, MatDialogModule],
})
export class SurveyComponent {
  public safeSurveyUrl: SafeResourceUrl;

  public constructor(
    private readonly sanitizer: DomSanitizer,
    @Inject(DIALOG_DATA) public data: { url: string }
  ) {
    this.safeSurveyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      data.url
    );
  }
}
