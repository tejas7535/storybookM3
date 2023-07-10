import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ea-expansion-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatExpansionModule],
  templateUrl: './expansion-panel.component.html',
})
export class ExpansionPanelComponent {
  @Input() id: string;
  @Input() expanded: boolean;
  @Input() title: string;
  @Input() icon?: string;
  @Input() iconClassName?: string;
  @Input() svgIcon?: string;
}
