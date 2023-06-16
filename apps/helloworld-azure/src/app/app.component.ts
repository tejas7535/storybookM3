import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getProfileImage, getUsername } from '@schaeffler/azure-auth';

@Component({
  selector: 'helloworld-azure-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  platformTitle = 'Hello World Azure';

  username$: Observable<string>;
  profileImage$: Observable<string>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.username$ = this.store.select(getUsername);
    this.profileImage$ = this.store.select(getProfileImage);
  }
}
