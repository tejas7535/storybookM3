import { HttpClientTestingModule } from '@angular/common/http/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ENV_CONFIG } from '@schaeffler/http';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let spectator: Spectator<HomeComponent>;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [HttpClientTestingModule],
    declarations: [HomeComponent],
    providers: [
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: 'http://localhost:8080/api/v1',
          },
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
