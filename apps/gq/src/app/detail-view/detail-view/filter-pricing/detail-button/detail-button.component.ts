import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { EVENT_NAMES } from '../../../../../../src/app/shared/models';
import { AppRoutePath } from '../../../../app-route-path.enum';

@Component({
  selector: 'gq-detail-button',
  templateUrl: './detail-button.component.html',
})
export class DetailButtonComponent {
  @Input() text: string;
  @Input() path: string;
  @ViewChild(MatMenuTrigger) public contextMenu: MatMenuTrigger;

  public contextMenuPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(
    private readonly router: Router,
    private readonly insightsService: ApplicationInsightsService
  ) {}

  navigateClick(): void {
    this.router.navigate([`${AppRoutePath.DetailViewPath}/${this.path}`], {
      queryParamsHandling: 'preserve',
    });

    this.insightsService.logEvent(EVENT_NAMES.GQ_PRICING_DETAILS_VIEWED);
  }

  public showContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX;
    this.contextMenuPosition.y = event.clientY;

    this.contextMenu.openMenu();
  }

  public getUrl(): string {
    return `${window.location.origin}/${AppRoutePath.DetailViewPath}/${this.path}${window.location.search}`;
  }
}
