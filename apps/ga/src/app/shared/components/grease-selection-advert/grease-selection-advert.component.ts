import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ga-grease-selection-advert',
  templateUrl: './grease-selection-advert.component.html',
  imports: [SharedTranslocoModule, MatIconModule],
})
export class GreaseSelectionAdvertComponent {}
