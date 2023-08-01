import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  templateUrl: './qualtrics-survey.component.html',
  standalone: true,
  imports: [MatIconModule, MatDialogModule],
})
export class QualtricsSurveyComponent {
  surveyUrl: SafeResourceUrl;

  constructor(private readonly sanitizer: DomSanitizer) {
    this.surveyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://schaefflertech.qualtrics.com/jfe/form/SV_3wJxHoC3sDjvcCa'
    );
  }
}
