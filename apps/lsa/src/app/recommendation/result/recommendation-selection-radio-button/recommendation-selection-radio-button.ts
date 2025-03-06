import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'lsa-recommendation-selection-radio-button',
  templateUrl: './recommendation-selection-radio-button.html',
  imports: [MatRadioModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationSelectionRadioButtonComponent {
  @Input() title: string;
  @Input() value: string;
  @Input() selected: boolean;
}
