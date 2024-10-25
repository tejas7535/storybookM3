import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { isLanguageAvailable } from './core/services/language-helpers';
import { PriceAvailabilityService } from './core/services/price-availability.service';
import { RestService } from './core/services/rest.service';
import { FALLBACK_LANGUAGE } from './shared/constants/language';
import { UserTier } from './shared/constants/user-tier';
import { AvailabilityRequestEvent } from './shared/models/price-availibility.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lubricator-selection-assistant',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  @Input() language: string | undefined;

  @Input() userTier: UserTier;

  @Output() availabilityRequest = new EventEmitter<AvailabilityRequestEvent>();

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly restService: RestService,
    private readonly priceAvailabilityService: PriceAvailabilityService
  ) {}

  ngOnInit(): void {
    const currentLanguage = isLanguageAvailable(this.language)
      ? this.language
      : FALLBACK_LANGUAGE.id;

    this.translocoService.setActiveLang(currentLanguage);

    this.listenForPriceAndAvailabilityRequests();
    this.fetchGreases();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  fetchGreases(): void {
    this.restService.getGreases();
  }

  private listenForPriceAndAvailabilityRequests(): void {
    this.priceAvailabilityService.priceAndAvailabilityRequest$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: AvailabilityRequestEvent) => {
        this.availabilityRequest.emit(event);
      });
  }
}
