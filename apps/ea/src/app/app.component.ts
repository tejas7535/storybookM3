import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { Store } from '@ngrx/store';

import { ProductSelectionActions, SettingsActions } from './core/store/actions';
import { DEFAULT_BEARING_DESIGNATION } from './shared/constants/products';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'engineering-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnChanges {
  public title = 'Engineering App';

  @Input() bearingDesignation: string | undefined;
  @Input() standalone: string | undefined;

  public constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
    private readonly store: Store
  ) {
    this.registerEAIcons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bearingDesignation) {
      this.store.dispatch(
        ProductSelectionActions.setBearingDesignation({
          bearingDesignation: changes.bearingDesignation.currentValue,
        })
      );
    }

    if (changes.standalone) {
      this.store.dispatch(
        SettingsActions.setStandalone({
          isStandalone: changes.standalone.currentValue === 'true',
        })
      );
    }
  }

  ngOnInit(): void {
    if (!this.bearingDesignation) {
      // trigger calculations with default bearing
      this.store.dispatch(
        ProductSelectionActions.setBearingDesignation({
          bearingDesignation: DEFAULT_BEARING_DESIGNATION,
        })
      );
    }
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
