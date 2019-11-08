import { Component } from '@angular/core';

@Component({
  selector: 'schaeffler-frontend-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  /**
   * Contains active userName
   */
  public username = 'Test User';

  /**
   * App-name for sidenav
   */
  public platformTitle = 'GENERAL.APP_NAME';

  /**
   * Call logout as store action call
   */
  public logoutUser(): void {
    console.log('You just logged out');
  }

  /**
   * Change sidebarState by breakpointService
   */
  public toggleSidebar(): void {
    console.log('You just toggled the sidebar');
  }
}
