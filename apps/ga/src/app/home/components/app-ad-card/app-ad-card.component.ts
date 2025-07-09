import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { TagComponent } from '@schaeffler/tag';

import { UTM_PARAMS_DEFAULT } from '@ga/shared/constants';

@Component({
  selector: 'ga-app-ad-card',
  templateUrl: './app-ad-card.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    TagComponent,
    CommonModule,
    TranslocoModule,
  ],
})
export class AppAdCardComponent {
  private readonly translocoService = inject(TranslocoService);

  public readonly imageUrl = input<string>();
  public readonly appUrl = input<string>();
  public readonly translocoPrefix = input<string>();
  public readonly includeUTM = input<boolean>(false);

  protected readonly ctaURL = computed(() => {
    let returnValue = this.translocoService.translate(
      `${this.translocoPrefix()}.externalUrl`
    );

    if (this.includeUTM()) {
      returnValue += `?${UTM_PARAMS_DEFAULT}`;
    }

    return returnValue;
  });

  protected getTranslation(key: string) {
    return this.translocoService.translate(`${this.translocoPrefix()}.${key}`);
  }
}
