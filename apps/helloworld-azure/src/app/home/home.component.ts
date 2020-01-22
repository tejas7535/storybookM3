import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { GreetingService } from '../greeting.service';

@Component({
  selector: 'schaeffler-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public response: Observable<string>;

  constructor(private readonly greetingsService: GreetingService) {}

  public ngOnInit(): void {
    this.response = this.greetingsService.greet();
  }
}
