import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'mm-horizontal-separator',
  templateUrl: './horizontal-separator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class HorizontalSeparatorComponent {
  @Input() public text!: string;

  @Input() public alwaysCentered = false;
}
