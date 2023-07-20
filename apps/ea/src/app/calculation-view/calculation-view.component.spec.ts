import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { MockModule } from 'ng-mocks';
import { CalculationViewComponent } from './calculation-view.component';

describe('CalculationViewComponent', () => {
  let component = CalculationViewComponent;
  let spectator: Spectator<CalculationViewComponent>;

  const createComponent = createComponentFactory({
    component: CalculationViewComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatIconTestingModule,
      MockModule(MatDividerModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          ...APP_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
