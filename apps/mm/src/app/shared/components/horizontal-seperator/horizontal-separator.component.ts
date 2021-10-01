import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'mm-horizontal-separator',
  templateUrl: './horizontal-separator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalSeparatorComponent {
  @Input() public text!: string;

  @Input() public alwaysCentered = false;
}
