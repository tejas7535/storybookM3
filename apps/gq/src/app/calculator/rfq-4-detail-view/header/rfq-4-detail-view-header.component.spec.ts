import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Rfq4DetailViewHeaderComponent } from './rfq-4-detail-view-header.component';

describe('HeaderComponent', () => {
  let component: Rfq4DetailViewHeaderComponent;
  let spectator: Spectator<Rfq4DetailViewHeaderComponent>;
  const params = {
    get: (param: string) => {
      if (param === 'rfqId') {
        return '12345';
      }

      return 'null';
    },
  };

  const createComponent = createComponentFactory({
    component: Rfq4DetailViewHeaderComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: of(params),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
