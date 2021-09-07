import { Component } from '@angular/core';

import { serivceNowAdress } from '../../constants';

@Component({
  selector: 'gq-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent {
  serivceNowAdress = serivceNowAdress;
}
