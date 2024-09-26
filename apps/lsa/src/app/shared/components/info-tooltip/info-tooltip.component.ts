import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  standalone: true,
  selector: 'lsa-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  imports: [
    SharedTranslocoModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class InfoTooltipComponent {
  @Input()
  public translationKey: string;
}
