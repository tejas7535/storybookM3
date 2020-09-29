import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Component({
  selector: 'ia-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  demo$: Observable<String>;

  public constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.demo$ = this.http.get(`${environment.baseUrl}/hello-world`, {
      responseType: 'text',
    });
  }
}
