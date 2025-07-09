import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'ga-badge',
  templateUrl: './badge.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class BadgeComponent {
  public text = input.required<string>();
  public secondaryText = input<string | undefined>();
  public badgeClass = input<string>('');
}
