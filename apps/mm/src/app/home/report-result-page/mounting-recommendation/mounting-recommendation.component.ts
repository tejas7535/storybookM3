import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mm-mounting-recommendation',
  templateUrl: './mounting-recommendation.component.html',
  imports: [SharedTranslocoModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MountingRecommendationComponent {
  @Input() public mountingRecommendations: string[] = [];
  @Input() public versions?: string;
}
