import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'd360-styled-grid-section',
  imports: [CommonModule],
  templateUrl: './styled-grid-section.component.html',
  styleUrls: ['./styled-grid-section.component.scss'],
})
export class StyledGridSectionComponent {
  @Input() hidden?: boolean;
  @Input() smallHeight?: boolean;
}
