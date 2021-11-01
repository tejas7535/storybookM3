import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ForbiddenEventService } from './forbidden-event.service';
import { ForbiddenRouteData } from './models/forbidden-route-data.model';

@Component({
  selector: 'schaeffler-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'],
})
export class ForbiddenComponent {
  public routeData: ForbiddenRouteData;

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly forbiddenEventService: ForbiddenEventService
  ) {
    this.routeData = this.activatedRoute.snapshot.data;
  }

  public onActionButtonClick() {
    this.forbiddenEventService.forbiddenPageActionButtonClicked$.next();
  }
}
