import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

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
  @Input() bearingDesignation: string | undefined;
  @Input() standalone: string | undefined;

  public title = 'Engineering App';

  public constructor(private readonly store: Store) {}

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
}
