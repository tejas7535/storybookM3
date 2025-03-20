import { MockProvider } from 'ng-mocks';

import { CurrencyService } from '../../feature/info/currency.service';
import { Stub } from '../../shared/test/stub.class';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;

  beforeEach(() => {
    component = Stub.get<HomeComponent>({
      component: HomeComponent,
      providers: [
        // we need it here, can't be removed!
        MockProvider(CurrencyService, Stub.getCurrencyService(), 'useValue'),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
