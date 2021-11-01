import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForbiddenEventService {
  public forbiddenPageActionButtonClicked$ = new Subject<void>();
}
