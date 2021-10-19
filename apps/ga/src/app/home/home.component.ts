import { Component } from '@angular/core';

import { environment } from '../../environments/environment';
import { AppRoutePath } from '../app-route-path.enum';

@Component({
  selector: 'ga-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  greaseCalculationLink = `/${AppRoutePath.GreaseCalculationPath}`;
  sources = environment.production
    ? '?utm_source=grease-app&utm_medium=app'
    : '';
}
