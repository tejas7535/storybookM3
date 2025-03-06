import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { userUrlAccount } from '../../constants';

@Component({
  selector: 'schaeffler-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class UserPanelComponent {
  @Input() public userName?: string;
  @Input() public userImageUrl?: string;

  public urlAccount = userUrlAccount;
}
