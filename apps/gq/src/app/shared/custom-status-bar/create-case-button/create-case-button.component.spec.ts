import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CreateCaseButtonComponent } from './create-case-button.component';

describe('CreateCaseButtonComponent', () => {
  let component: CreateCaseButtonComponent;
  let spectator: Spectator<CreateCaseButtonComponent>;

  const createComponent = createComponentFactory({
    component: CreateCaseButtonComponent,
    declarations: [CreateCaseButtonComponent],
    imports: [
      CommonModule,
      SharedTranslocoModule,
      MatButtonModule,
      ReactiveComponentModule,
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
