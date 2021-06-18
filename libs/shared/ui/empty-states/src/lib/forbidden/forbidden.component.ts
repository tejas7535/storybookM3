import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'schaeffler-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'],
})
export class ForbiddenComponent {
  public action: string;

  public constructor(private readonly activatedRoute: ActivatedRoute) {
    this.action = this.activatedRoute.snapshot.data.action;
  }
}
