import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

@Component({
  selector: 'ia-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  demo$: Observable<String>;

  public constructor(private readonly dataService: DataService) {}

  ngOnInit(): void {
    this.demo$ = this.dataService.getAll<string>('hello-world', {
      responseType: 'text',
    });
  }
}
