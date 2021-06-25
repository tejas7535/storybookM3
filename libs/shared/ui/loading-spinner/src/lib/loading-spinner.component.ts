import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'schaeffler-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  @Input() public backgroundColor?: string;
  @Input() public relative?: boolean;
  @Input() public diameter?: number = 100;
  @Input() public strokeWidth?: number = 10;
}
