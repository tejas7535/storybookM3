import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { AddToCartService } from './core/services/add-to-cart.service';
import { isLanguageAvailable } from './core/services/language-helpers';
import { PriceAvailabilityService } from './core/services/price-availability.service';
import { RestService } from './core/services/rest.service';
import { FALLBACK_LANGUAGE } from './shared/constants/language';
import { UserTier } from './shared/constants/user-tier.enum';
import { AddToCartEventPayload } from './shared/models';
import { AvailabilityRequestEvent } from './shared/models/price-availibility.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lubricator-selection-assistant',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy, OnChanges {
  @Input() language: string | undefined;

  @Output() availabilityRequest = new EventEmitter<AvailabilityRequestEvent>();

  @Output() addToCart = new EventEmitter<AddToCartEventPayload>();

  @Input() userTier: UserTier;

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly restService: RestService,
    private readonly priceAvailabilityService: PriceAvailabilityService,
    private readonly addToCartService: AddToCartService
  ) {}

  ngOnInit(): void {
    const currentLanguage = isLanguageAvailable(this.language)
      ? this.language
      : FALLBACK_LANGUAGE.id;

    this.translocoService.setActiveLang(currentLanguage);

    this.listenForPriceAndAvailabilityRequests();
    this.listenForAddToCartEvents();
    this.fetchGreases();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userTier) {
      this.addToCartService.setUserTier(this.userTier);
    }
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

  private listenForAddToCartEvents(): void {
    this.addToCartService.addToCartEvent$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: AddToCartEventPayload) => {
        this.addToCart.emit(event);
      });
  }
}
