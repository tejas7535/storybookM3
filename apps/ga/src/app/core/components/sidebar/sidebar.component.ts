import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'ga-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @ViewChild('sidenav') private readonly sidenav!: MatSidenav;

  public toggle(): void {
    this.sidenav.toggle();
  }
}
