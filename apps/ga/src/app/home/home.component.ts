import { Component } from '@angular/core';

import { AppRoutePath } from '../app-route-path.enum';

@Component({
  selector: 'ga-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  bearingLink = `/${AppRoutePath.BearingPath}`;
}
