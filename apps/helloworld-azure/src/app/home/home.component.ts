import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { GreetingService } from '../greeting.service';

@Component({
  selector: 'helloworld-azure-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public responsePublic$: Observable<string>;
  public responseAuthorized$: Observable<string>;
  public responseUsers$: Observable<string>;
  public responseAdmins$: Observable<string>;
  public responseDotNetPublic$: Observable<string>;
  public responseDotNetAuthorized$: Observable<string>;
  public responseDotNetUsers$: Observable<string>;
  public responseDotNetAdmins$: Observable<string>;

  constructor(private readonly greetingsService: GreetingService) {}

  public ngOnInit(): void {
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
