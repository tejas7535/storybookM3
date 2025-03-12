import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { CurrencyService } from '../../feature/info/currency.service';
import { Stub } from '../../shared/test/stub.class';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;

  beforeEach(() => {
    component = Stub.get({
      component: HomeComponent,
      providers: [
        MockProvider(CurrencyService, {
          getCurrentCurrency: jest.fn().mockReturnValue(of({})),
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
