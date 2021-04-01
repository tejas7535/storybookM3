import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { MaterialTransformPipe } from '../../../shared/pipes/material-transform.pipe';
import { MaterialDetailsComponent } from './material-details.component';

describe('MaterialDetailsComponent', () => {
  let component: MaterialDetailsComponent;
  let spectator: Spectator<MaterialDetailsComponent>;

  const createComponent = createComponentFactory({
    component: MaterialDetailsComponent,
    detectChanges: false,
    imports: [provideTranslocoTestingModule({})],
    providers: [provideMockStore({})],
    declarations: [MaterialDetailsComponent, MaterialTransformPipe],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
