import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { GreetingService } from '../greeting.service';

@Component({
  selector: 'schaeffler-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public responsePublic: Observable<string>;
  public responseAuthorized: Observable<string>;
  public responseUsers: Observable<string>;
  public responseAdmins: Observable<string>;

  constructor(private readonly greetingsService: GreetingService) {}

  public ngOnInit(): void {
    this.responsePublic = this.greetingsService.greetPublic();
    this.responseAuthorized = this.greetingsService.greetAuthorized();
    this.responseUsers = this.greetingsService.greetUsers();
    this.responseAdmins = this.greetingsService.greetAdmins();
  }
}
