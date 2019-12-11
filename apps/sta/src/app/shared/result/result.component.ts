import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { DataService } from './data.service';

@Component({
  selector: 'sta-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  public tags$: Observable<string[]>;

  constructor(private readonly dataService: DataService) {}

  public ngOnInit(): void {
    this.setObservables();
  }

  private setObservables(): void {
    this.tags$ = this.dataService.tags;
  }
}
