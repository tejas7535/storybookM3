import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutePath } from '../../../../app-route-path.enum';

@Component({
  selector: 'gq-detail-button',
  templateUrl: './detail-button.component.html',
})
export class DetailButtonComponent {
  @Input() text: string;
  @Input() path: string;

  constructor(private readonly router: Router) {}

  navigateClick(): void {
    this.router.navigate([`${AppRoutePath.DetailViewPath}/${this.path}`], {
      queryParamsHandling: 'preserve',
    });
  }
}
