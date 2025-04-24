import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { FEEDBACK_URL } from '../shared/urls';

@Component({
  selector: 'ia-user',
  templateUrl: './user.component.html',
  standalone: false,
})
export class UserComponent {
  isSubmitInProgress$: Observable<boolean>;
  feedbackUrl = FEEDBACK_URL;
}
