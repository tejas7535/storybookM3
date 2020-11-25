import { Component, Input, OnInit } from '@angular/core';

import { interval, Observable } from 'rxjs';
import { mergeMap, startWith } from 'rxjs/operators';

import { FunFactsLoadingBarService } from './fun-facts-loading-bar.service';

@Component({
  selector: 'sta-fun-facts-loading-bar',
  templateUrl: './fun-facts-loading-bar.component.html',
  styleUrls: ['./fun-facts-loading-bar.component.scss'],
})
export class FunFactsLoadingBarComponent implements OnInit {
  @Input() public imageUrl = '../../../assets/empty-states/translation.png';
  @Input() public taskPendingText =
    'We are working at full speed on translating your text.';

  public funFact$: Observable<string>;

  constructor(private readonly funFactService: FunFactsLoadingBarService) {}

  public ngOnInit(): void {
    this.funFact$ = interval(8000).pipe(
      startWith(0),
      mergeMap(() => this.funFactService.getFunFact())
    );
  }
}
