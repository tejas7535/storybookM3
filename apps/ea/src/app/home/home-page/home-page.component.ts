import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Meta, Title } from '@angular/platform-browser';

import { combineLatest, filter, Observable, Subject, takeUntil } from 'rxjs';

import { Card } from '@ea/core/services/home/card.model';
import { HomeCardsService } from '@ea/core/services/home/home-cards.service';
import { TrackingService } from '@ea/core/services/tracking-service/tracking.service';
import { SettingsFacade } from '@ea/core/store';
import { AppStoreButtonsComponent } from '@ea/shared/app-store-buttons/app-store-buttons.component';
import { QualtricsInfoBannerComponent } from '@ea/shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { TranslocoService } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HomePageCardComponent } from '../home-page-card/home-page-card.component';
import { HomePageSustainabilityCardComponent } from '../home-page-sustainability-card/home-page-sustainability-card.component';
import { QuickBearingSelectionComponent } from '../quick-bearing-selection';

@Component({
  selector: 'ea-home-page',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    HomePageCardComponent,
    PushPipe,
    SharedTranslocoModule,
    MatIconModule,
    QuickBearingSelectionComponent,
    HomePageSustainabilityCardComponent,
    QualtricsInfoBannerComponent,
    AppStoreButtonsComponent,
  ],
})
export class HomePageComponent implements OnInit, OnDestroy {
  public sustainbilityCard$ = this.homeCardsService.sustainabilityCard$;
  public homeCards$: Observable<Card[]> = this.homeCardsService.homeCards$;
  private readonly destroy$: Subject<void> = new Subject();

  constructor(
    private readonly homeCardsService: HomeCardsService,
    private readonly translocoService: TranslocoService,
    private readonly settingsFacade: SettingsFacade,
    private readonly titleService: Title,
    private readonly metaService: Meta,
    private readonly trackingService: TrackingService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.settingsFacade.isStandalone$,
      this.translocoService.selectTranslate('appTitle'),
      this.translocoService.selectTranslate('homePage.description'),
    ])
      .pipe(
        filter(([standalone]) => standalone),
        takeUntil(this.destroy$)
      )
      .subscribe(([_, title, description]) =>
        this.updateLocalizedMetatags(title, description)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  updateLocalizedMetatags(title: string, description: string): void {
    const lang = this.translocoService.getActiveLang();
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'twitter:title', content: title });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    this.metaService.updateTag({
      property: 'twitter:description',
      content: description,
    });
    this.document.documentElement.lang = lang;
  }

  sendClickEvent(storeName: string) {
    this.trackingService.logAppStoreClick(storeName, 'home');
  }
}
