import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslocoService } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'lsa-legal-disclaimer',
  templateUrl: './legal-disclaimer.component.html',
  standalone: true,
  imports: [SharedTranslocoModule, MatIconModule, MatButtonModule],
})
export class LegalDisclaimerComponent implements OnInit {
  showFullText = true;
  maxLength = 160;
  public disclaimer = '';
  private readonly translocoService = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  get shortDisclaimer(): string {
    return this.disclaimer.length > this.maxLength
      ? `${this.disclaimer.slice(0, this.maxLength)}...`
      : this.disclaimer;
  }

  ngOnInit(): void {
    this.translocoService
      .selectTranslate('disclaimer.text')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((disclaimerValue) => {
        this.disclaimer = disclaimerValue;
      });
  }

  toggleDisclaimerLength() {
    this.showFullText = !this.showFullText;
  }
}
