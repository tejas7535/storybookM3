import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'schaeffler-horizontal-separator',
  templateUrl: './horizontal-separator.component.html',
  styleUrls: ['./horizontal-separator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalSeparatorComponent {
  @Input() text!: string;

  @Input() alwaysCentered = false;
}
