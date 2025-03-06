import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mm-horizontal-separator',
  templateUrl: './horizontal-separator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class HorizontalSeparatorComponent {
  public text = input.required<string>();

  public alwaysCentered = input(false);
}
