import { Component } from '@angular/core';

import { homepageCards } from './constants';

@Component({
  selector: 'ga-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public homepageCards = homepageCards;
}
