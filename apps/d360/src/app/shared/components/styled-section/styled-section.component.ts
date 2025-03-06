import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'd360-styled-section',
  imports: [CommonModule],
  templateUrl: './styled-section.component.html',
  styleUrls: ['./styled-section.component.scss'],
})
export class StyledSectionComponent {
  @Input() last?: boolean;
  @Input() grow?: boolean;
  @Input() fullHeight?: boolean;
}
