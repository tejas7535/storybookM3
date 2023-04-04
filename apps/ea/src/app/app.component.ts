import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'engineering-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'Engineering App';

  public constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {
    this.registerEAIcons();
  }

  public registerEAIcons(): void {
    const iconSet: Record<string, string> = {
      co2: 'icon_CO2.svg',
      airwaves: 'icon_airwaves.svg',
      calculation: 'icon_calculations.svg',
      friction_load: 'icon_load_frictional_powerloss.svg',
      lubrication_parameters: 'icon_lubrication_parameters',
      rating_life: 'icon_rpm_rating_life.svg',
    };
    for (const [name, url] of Object.entries(iconSet)) {
      const setUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `../assets/icons/${url}`
      );
      this.matIconRegistry.addSvgIcon(name, setUrl);
    }
  }
}
