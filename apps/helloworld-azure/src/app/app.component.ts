import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { AuthService } from './core/auth.service';

@Component({
  selector: 'schaeffler-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public platformTitle = 'Hello World Azure';
  public username: Observable<string>;

  public response: Observable<string>;

  public constructor(private readonly authService: AuthService) {
    this.authService.initAuth();
  }

  public ngOnInit(): void {
    this.username = this.authService.getUserName();
  }
}
