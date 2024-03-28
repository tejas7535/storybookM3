import { ReactiveFormsModule } from '@angular/forms';

import { Observable } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { PagedMeta } from '../home.model';
import { CalculationOptionsComponent } from './calculation-options.component';

describe('CalculationOptionsComponent', () => {
  let component: CalculationOptionsComponent;
  let spectator: Spectator<CalculationOptionsComponent>;

  const pageMeta = {
    metas: {},
    children: [],
    valid$: new Observable<boolean>(),
  } as PagedMeta;

  const createComponent = createComponentFactory({
    component: CalculationOptionsComponent,
    imports: [ReactiveFormsModule, PushPipe],
    declarations: [CalculationOptionsComponent],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        pageMeta,
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
