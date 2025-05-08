import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'd360-styled-section',
  imports: [CommonModule],
  templateUrl: './styled-section.component.html',
  styleUrls: ['./styled-section.component.scss'],
})
export class StyledSectionComponent {
  public last: InputSignal<boolean> = input<boolean>(false);
  public grow: InputSignal<boolean> = input<boolean>(false);
  public fullHeight: InputSignal<boolean> = input<boolean>(false);
  public suppressPadding: InputSignal<boolean> = input<boolean>(false);
}
