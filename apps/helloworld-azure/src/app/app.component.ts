import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { GreetingService } from './greeting.service';

@Component({
  selector: 'schaeffler-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public platformTitle = 'Hello World Azure';
  public username = 'Test User';

  public response: Observable<string>;

  public constructor(private readonly greetingsService: GreetingService) {}

  public ngOnInit(): void {
    this.response = this.greetingsService.greet();
  }
}
