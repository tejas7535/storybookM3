import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'schaeffler-horizontal-separator',
  templateUrl: './horizontal-separator.component.html',
  styleUrls: ['./horizontal-separator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalSeparatorComponent {
  @Input() public text!: string;

  @Input() public alwaysCentered = false;
}
