import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

import {
  AddToCartEvent,
  AddToCartService,
} from '@schaeffler/engineering-apps-behaviors/medias';

import { LSACartService } from './core/services/add-to-cart.service';
import { isLanguageAvailable } from './core/services/language-helpers';
import { PriceAvailabilityService } from './core/services/price-availability.service';
import { RestService } from './core/services/rest.service';
import { StaticStorageService } from './core/services/static-storage';
import { FALLBACK_LANGUAGE } from './shared/constants/language';
import { UserTier } from './shared/constants/user-tier.enum';
import { Unitset } from './shared/models/preferences.model';
import { AvailabilityRequestEvent } from './shared/models/price-availibility.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lubricator-selection-assistant',
  templateUrl: './app.component.html',
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  @Output() availabilityRequest = new EventEmitter<AvailabilityRequestEvent>();

  @Output() addToCart = new EventEmitter<AddToCartEvent>();

  protected unitsetSelectionControl = new FormControl<Unitset>(Unitset.SI);

  private _language: string | undefined;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly restService: RestService,
    private readonly priceAvailabilityService: PriceAvailabilityService,
    private readonly lsaCartService: LSACartService,
    private readonly staticStorageService: StaticStorageService,
    private readonly mediasCartService: AddToCartService,
    @Inject(LOCAL_STORAGE) private readonly localStorage: Storage
  ) {}

  @Input() set language(value: string | undefined) {
    if (value) {
      this.setLanguageInLocalStorage(value);
    }
  }

  @Input() set userTier(value: UserTier) {
    this.lsaCartService.setUserTier(value);
  }

  ngOnInit(): void {
    this.listenForPriceAndAvailabilityRequests();
    this.mediasCartService.cartEvents$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event) => this.addToCart.emit(event));
    this.fetchGreases();
    this.unitsetSelectionControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        this.restService.setUnitset(value);
      });
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
}
