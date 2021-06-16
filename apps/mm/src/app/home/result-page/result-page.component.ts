import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { RawValue, RawValueContent, Result } from '../../shared/models';
import { ResultPageService } from './result-page.service';

@Component({
  selector: 'mm-result-page',
  templateUrl: './result-page.component.html',
  providers: [ResultPageService],
})
export class ResultPageComponent {
  @Input() public active? = false;

  public result$: Observable<Result>;

  public constructor(private readonly resultPageService: ResultPageService) {}

  public send(form: FormGroup): void {
    // TODO: check lint rules
    const formProperties = form
      .getRawValue()
      // eslint-disable-next-line unicorn/no-array-reduce
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

  public resetWizard(): void {
    // eslint-disable-next-line no-console
    console.log('go to step first possible step');
  }
}
