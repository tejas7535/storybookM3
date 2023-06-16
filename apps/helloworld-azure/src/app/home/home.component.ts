import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { GreetingService } from '../greeting.service';

@Component({
  selector: 'helloworld-azure-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  responsePublic$: Observable<string>;
  responseAuthorized$: Observable<string>;
  responseUsers$: Observable<string>;
  responseAdmins$: Observable<string>;
  responseDotNetPublic$: Observable<string>;
  responseDotNetAuthorized$: Observable<string>;
  responseDotNetUsers$: Observable<string>;
  responseDotNetAdmins$: Observable<string>;

  constructor(private readonly greetingsService: GreetingService) {}

  ngOnInit(): void {
    this.responsePublic$ = this.greetingsService.greetPublic();
    this.responseAuthorized$ = this.greetingsService.greetAuthorized();
    this.responseUsers$ = this.greetingsService.greetUsers();
    this.responseAdmins$ = this.greetingsService.greetAdmins();
    this.responseDotNetPublic$ = this.greetingsService.greetDotNetPublic();
    this.responseDotNetAuthorized$ =
      this.greetingsService.greetDotNetAuthorized();
    this.responseDotNetUsers$ = this.greetingsService.greetDotNetUsers();
    this.responseDotNetAdmins$ = this.greetingsService.greetDotNetAdmins();
  }
}
