import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { ResultPageService } from './result-page.service';
import { RawValue, RawValueContent, Result } from './result.model';

@Component({
  selector: 'mm-result-page',
  templateUrl: './result-page.component.html',
  providers: [ResultPageService],
})
export class ResultPageComponent {
  @Input() active?: false;

  result$: Observable<Result>;

  constructor(private readonly resultPageService: ResultPageService) {}

  public send(form: FormGroup): void {
    const formProperties = form
      .getRawValue()
      .objects[0].properties.reduce(
        (
          { dimension1, initialValue, ...prevEntry }: RawValue,
          { name, value }: RawValueContent
        ) => {
          const key = name === 'RSY_BEARING' ? 'IDCO_DESIGNATION' : name;

          return {
            ...prevEntry,
            [key]: value,
          };
        },
        {}
      );

    this.result$ = this.resultPageService.getResult(formProperties);
  }
}
