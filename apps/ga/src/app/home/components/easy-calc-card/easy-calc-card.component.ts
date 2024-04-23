import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslocoModule } from '@jsverse/transloco';

import { TagComponent } from '@schaeffler/tag';

import { UTM_PARAMS_DEFAULT } from '@ga/shared/constants';

@Component({
  selector: 'ga-easy-calc-card',
  templateUrl: './easy-calc-card.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    TagComponent,
    CommonModule,
    TranslocoModule,
  ],
})
export class EasyCalcCardComponent {
  public readonly imageUrl = 'assets/images/ec-icon.svg';
  public readonly appUrl = `https://medias-easycalc.com/home?${UTM_PARAMS_DEFAULT}`;
}
