import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { AddToCartService } from './core/services/add-to-cart.service';
import { isLanguageAvailable } from './core/services/language-helpers';
import { PriceAvailabilityService } from './core/services/price-availability.service';
import { RestService } from './core/services/rest.service';
import { StaticStorageService } from './core/services/static-storage';
import { FALLBACK_LANGUAGE } from './shared/constants/language';
import { UserTier } from './shared/constants/user-tier.enum';
import { AddToCartEventPayload } from './shared/models';
import { AvailabilityRequestEvent } from './shared/models/price-availibility.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lubricator-selection-assistant',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  @Output() availabilityRequest = new EventEmitter<AvailabilityRequestEvent>();

  @Output() addToCart = new EventEmitter<AddToCartEventPayload>();

  private _language: string | undefined;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly restService: RestService,
    private readonly priceAvailabilityService: PriceAvailabilityService,
    private readonly addToCartService: AddToCartService,
    private readonly staticStorageService: StaticStorageService,
    @Inject(LOCAL_STORAGE) private readonly localStorage: Storage
  ) {}

  @Input() set language(value: string | undefined) {
    if (value) {
      this.setLanguageInLocalStorage(value);
    }
  }

  @Input() set userTier(value: UserTier) {
    this.addToCartService.setUserTier(value);
  }

  ngOnInit(): void {
    this.listenForPriceAndAvailabilityRequests();
    this.listenForAddToCartEvents();
    this.fetchGreases();

    this.staticStorageService.displayMaintenanceMessages();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  fetchGreases(): void {
    this.restService.getGreases();
  }

  private setLanguageInLocalStorage(lang: string): void {
    const currentLanguage = this.getLanguage(lang);
    this._language = currentLanguage;

    this.translocoService.setActiveLang(this._language);
    this.localStorage.setItem('language', this._language);
  }

  private getLanguage(lang: string): string {
    return isLanguageAvailable(lang) ? lang : FALLBACK_LANGUAGE.id;
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
