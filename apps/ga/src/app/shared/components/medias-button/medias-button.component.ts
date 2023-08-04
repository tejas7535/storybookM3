import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MEDIASBEARING } from '@ga/features/grease-calculation/calculation-result/constants';
import { mediasBearings } from '@ga/shared/constants';

@Component({
  selector: 'ga-medias-button',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './medias-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediasButtonComponent implements OnInit {
  @Input() bearing: string;

  bearingInMedias: boolean;

  public constructor(
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  ngOnInit(): void {
    this.bearingInMedias = this.checkBearingInMedias();
  }

  public getBearingShopUrl(): string {
    return `${translate('calculationResult.shopBaseUrl')}/p/${
      this.bearing
    }?utm_source=grease-app`;
  }

  public checkBearingInMedias = (): boolean => this.bearing in mediasBearings;

  public trackBearingSelection(): void {
    this.applicationInsightsService.logEvent(MEDIASBEARING, {
      bearing: this.bearing,
    });
  }
}
