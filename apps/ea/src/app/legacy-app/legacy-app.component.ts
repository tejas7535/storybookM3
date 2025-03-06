import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { map, Observable, Subject, takeUntil } from 'rxjs';

import { LegacyAppService } from '@ea/core/services/legacy-app/legacy-app.service';
import { QualtricsInfoBannerComponent } from '@ea/shared/qualtrics-info-banner/qualtrics-info-banner.component';

@Component({
  selector: 'ea-legacy-app',
  templateUrl: './legacy-app.component.html',
  imports: [QualtricsInfoBannerComponent],
})
export class LegacyAppComponent implements OnInit, OnDestroy {
  @Input() bearingDesignation: string | undefined;

  public safeLegacyAppUrl: SafeResourceUrl;
  public legacyAppUrl$: Observable<SafeResourceUrl> =
    this.legacyAppService.legacyAppUrl$.pipe(
      map((url) => this.sanitizer.bypassSecurityTrustResourceUrl(url))
    );

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly legacyAppService: LegacyAppService,
    public readonly sanitizer: DomSanitizer
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.legacyAppService.legacyAppUrl$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((url) => {
        this.safeLegacyAppUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(url);
      });
  }
}
