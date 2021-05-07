import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'schaeffler-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  @Input() backgroundColor?: string;
  @Input() relative?: boolean;
}
