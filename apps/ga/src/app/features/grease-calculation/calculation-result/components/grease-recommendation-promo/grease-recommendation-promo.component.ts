import { CommonModule, JsonPipe, Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { GreaseRecommendationMarketingService } from '@ga/features/grease-calculation/grease-recommendation-marketing.service';
import { AppLogoComponent } from '@ga/shared/components/app-logo/app-logo.component';

import { OptionalIconPipe } from './optional-icon.pipe';

export type MediasFeatureTableEntry = string | { icon: 'checkmark' | 'cross' };

interface MediasFeatureTable {
  title: string;
  free: MediasFeatureTableEntry;
  plus: MediasFeatureTableEntry;
}

@Component({
  selector: 'ga-recommendation-modal',
  templateUrl: './grease-recommendation-promo.component.html',
  styleUrl: './grease-recommendation-promo.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    AppLogoComponent,
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
    JsonPipe,
    OptionalIconPipe,
    PushPipe,
  ],
})
export class GreaseRecommendationPromoComponent {
  public readonly mediasTable: MediasFeatureTable[] = [
    {
      title: 'allfeatures',
      free: 'Limited',
      plus: { icon: 'checkmark' },
    },
    {
      title: 'linearconfig',
      free: 'Limited',
      plus: { icon: 'checkmark' },
    },
    {
      title: 'cadfileslinear',
      free: { icon: 'cross' },
      plus: { icon: 'checkmark' },
    },
    {
      title: 'linearimport',
      free: { icon: 'cross' },
      plus: { icon: 'checkmark' },
    },
    {
      title: 'comparison',
      free: { icon: 'cross' },
      plus: { icon: 'checkmark' },
    },
    {
      title: 'campus',
      free: { icon: 'cross' },
      plus: { icon: 'checkmark' },
    },
    {
      title: 'wishlists',
      free: { icon: 'cross' },
      plus: { icon: 'checkmark' },
    },
    {
      title: 'cartrequest',
      free: { icon: 'cross' },
      plus: { icon: 'checkmark' },
    },
  ];

  public utmSignupUrl$ = this.marketingService.getUtmSignupUrl('result-popup');

  constructor(
    private readonly location: Location,
    private readonly marketingService: GreaseRecommendationMarketingService
  ) {}

  public backClick() {
    this.location.back();
  }

  public makeCellStyle(cellType: 'title' | 'free' | 'plus', row: number) {
    if (cellType === 'title') {
      return { 'grid-area': `${row}/1` };
    } else if (cellType === 'free') {
      return { 'grid-area': `${row}/2` };
    } else {
      return { 'grid-area': `${row}/3` };
    }
  }

  public typeof<T>(data: T) {
    return typeof data;
  }
}
